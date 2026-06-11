<?php
/*
Plugin Name: Marketing Site Studio Generator
Version: 0.1.0
*/

if (!defined('ABSPATH')) {
  exit;
}

const MSS_OPTION_APP_URL = 'mss_app_url';
const MSS_OPTION_PASSWORD = 'mss_password';

const MSS_TRANSIENT_TOKEN = 'mss_token_payload';

function mss_get_app_url() {
  $raw = get_option(MSS_OPTION_APP_URL, 'https://marketing-site-studio.vercel.app');
  $raw = is_string($raw) ? trim($raw) : '';
  return rtrim($raw, '/');
}

function mss_get_password() {
  $raw = get_option(MSS_OPTION_PASSWORD, '');
  return is_string($raw) ? trim($raw) : '';
}

function mss_get_cached_token() {
  $payload = get_transient(MSS_TRANSIENT_TOKEN);
  if (!is_array($payload)) {
    return null;
  }
  $token = isset($payload['token']) && is_string($payload['token']) ? $payload['token'] : '';
  $expiresAt = isset($payload['expiresAt']) ? intval($payload['expiresAt']) : 0;
  if (!$token || !$expiresAt) {
    return null;
  }
  if ($expiresAt < (time() * 1000) + 60000) {
    return null;
  }
  return $payload;
}

function mss_login_and_cache_token() {
  $appUrl = mss_get_app_url();
  $password = mss_get_password();
  if (!$password) {
    return new WP_Error('mss_missing_password', 'Mot de passe manquant dans les reglages du plugin.');
  }

  $response = wp_remote_post($appUrl . '/api/auth/login', array(
    'headers' => array('Content-Type' => 'application/json'),
    'timeout' => 30,
    'body' => wp_json_encode(array('password' => $password)),
  ));

  if (is_wp_error($response)) {
    return $response;
  }

  $code = wp_remote_retrieve_response_code($response);
  $body = wp_remote_retrieve_body($response);
  $data = json_decode($body, true);

  if ($code !== 200 || !is_array($data) || empty($data['token']) || empty($data['expiresAt'])) {
    $message = is_array($data) && !empty($data['error']) ? strval($data['error']) : 'Connexion impossible a l’application.';
    return new WP_Error('mss_login_failed', $message);
  }

  $token = strval($data['token']);
  $expiresAt = intval($data['expiresAt']);
  $ttl = max(60, intval(($expiresAt - (time() * 1000)) / 1000) - 60);

  $payload = array('token' => $token, 'expiresAt' => $expiresAt);
  set_transient(MSS_TRANSIENT_TOKEN, $payload, $ttl);
  return $payload;
}

function mss_get_token() {
  $cached = mss_get_cached_token();
  if ($cached) {
    return $cached;
  }
  return mss_login_and_cache_token();
}

function mss_generate_home_content($prospectUrl) {
  $appUrl = mss_get_app_url();
  $tokenPayload = mss_get_token();
  if (is_wp_error($tokenPayload)) {
    return $tokenPayload;
  }

  $token = strval($tokenPayload['token']);
  $response = wp_remote_post($appUrl . '/api/wp/generate-home', array(
    'headers' => array(
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer ' . $token,
    ),
    'timeout' => 60,
    'body' => wp_json_encode(array('url' => $prospectUrl)),
  ));

  if (is_wp_error($response)) {
    return $response;
  }

  $code = wp_remote_retrieve_response_code($response);
  $body = wp_remote_retrieve_body($response);
  $data = json_decode($body, true);

  if ($code !== 200 || !is_array($data) || empty($data['title']) || empty($data['content'])) {
    $message = is_array($data) && !empty($data['error']) ? strval($data['error']) : 'Generation impossible.';
    return new WP_Error('mss_generate_failed', $message);
  }

  $title = strval($data['title']);
  $slug = !empty($data['slug']) ? strval($data['slug']) : '';
  $content = strval($data['content']);

  return array('title' => $title, 'slug' => $slug, 'content' => $content);
}

function mss_create_draft_page($title, $slug, $content, $sourceUrl) {
  $postId = wp_insert_post(array(
    'post_type' => 'page',
    'post_status' => 'draft',
    'post_title' => $title,
    'post_content' => $content,
  ), true);

  if (is_wp_error($postId)) {
    return $postId;
  }

  if ($slug) {
    $unique = wp_unique_post_slug(sanitize_title($slug), intval($postId), 'draft', 'page', 0);
    wp_update_post(array('ID' => intval($postId), 'post_name' => $unique));
  }

  if ($sourceUrl) {
    update_post_meta(intval($postId), '_mss_source_url', $sourceUrl);
  }

  return intval($postId);
}

function mss_register_settings() {
  register_setting('mss_settings', MSS_OPTION_APP_URL);
  register_setting('mss_settings', MSS_OPTION_PASSWORD);
}
add_action('admin_init', 'mss_register_settings');

function mss_add_admin_menu() {
  add_menu_page(
    'Generateur prospects',
    'Generateur prospects',
    'manage_options',
    'mss-generator',
    'mss_render_admin_page',
    'dashicons-welcome-widgets-menus',
    58
  );
}
add_action('admin_menu', 'mss_add_admin_menu');

function mss_render_admin_page() {
  if (!current_user_can('manage_options')) {
    return;
  }

  $created = isset($_GET['mss_created']) ? intval($_GET['mss_created']) : 0;
  $error = isset($_GET['mss_error']) ? sanitize_text_field(wp_unslash($_GET['mss_error'])) : '';
  $message = isset($_GET['mss_message']) ? sanitize_text_field(wp_unslash($_GET['mss_message'])) : '';

  echo '<div class="wrap">';
  echo '<h1>Generateur de page prospect</h1>';

  if ($created) {
    $editUrl = get_edit_post_link($created, 'raw');
    if ($editUrl) {
      echo '<div class="notice notice-success"><p>Page brouillon creee. <a href="' . esc_url($editUrl) . '">Ouvrir l’edition</a></p></div>';
    }
  }

  if ($error) {
    $text = $message ? $message : $error;
    echo '<div class="notice notice-error"><p>' . esc_html($text) . '</p></div>';
  }

  echo '<h2>Reglages</h2>';
  echo '<form method="post" action="options.php">';
  settings_fields('mss_settings');
  echo '<table class="form-table" role="presentation">';

  echo '<tr><th scope="row"><label for="' . esc_attr(MSS_OPTION_APP_URL) . '">URL de l’application</label></th><td>';
  echo '<input name="' . esc_attr(MSS_OPTION_APP_URL) . '" type="url" class="regular-text" value="' . esc_attr(get_option(MSS_OPTION_APP_URL, 'https://marketing-site-studio.vercel.app')) . '" />';
  echo '</td></tr>';

  echo '<tr><th scope="row"><label for="' . esc_attr(MSS_OPTION_PASSWORD) . '">Mot de passe</label></th><td>';
  echo '<input name="' . esc_attr(MSS_OPTION_PASSWORD) . '" type="password" class="regular-text" value="' . esc_attr(get_option(MSS_OPTION_PASSWORD, '')) . '" autocomplete="new-password" />';
  echo '</td></tr>';

  echo '</table>';
  submit_button('Enregistrer');
  echo '</form>';

  echo '<hr />';
  echo '<h2>Generer une page</h2>';
  echo '<form method="post" action="' . esc_url(admin_url('admin-post.php')) . '">';
  echo '<input type="hidden" name="action" value="mss_generate" />';
  wp_nonce_field('mss_generate', 'mss_nonce');

  echo '<table class="form-table" role="presentation">';
  echo '<tr><th scope="row"><label for="mss_prospect_url">URL du prospect</label></th><td>';
  echo '<input name="mss_prospect_url" id="mss_prospect_url" type="url" class="regular-text" required />';
  echo '</td></tr>';
  echo '</table>';

  submit_button('Generer une page brouillon');
  echo '</form>';

  echo '</div>';
}

function mss_handle_generate() {
  if (!current_user_can('manage_options')) {
    wp_die('Acces refuse.');
  }

  check_admin_referer('mss_generate', 'mss_nonce');

  $url = isset($_POST['mss_prospect_url']) ? trim(strval(wp_unslash($_POST['mss_prospect_url']))) : '';
  if (!$url) {
    wp_safe_redirect(add_query_arg(array('page' => 'mss-generator', 'mss_error' => 'url_missing', 'mss_message' => rawurlencode('URL du prospect requise.')), admin_url('admin.php')));
    exit;
  }

  $result = mss_generate_home_content($url);
  if (is_wp_error($result)) {
    wp_safe_redirect(add_query_arg(array('page' => 'mss-generator', 'mss_error' => 'generate_failed', 'mss_message' => rawurlencode($result->get_error_message())), admin_url('admin.php')));
    exit;
  }

  $postId = mss_create_draft_page($result['title'], $result['slug'], $result['content'], $url);
  if (is_wp_error($postId)) {
    wp_safe_redirect(add_query_arg(array('page' => 'mss-generator', 'mss_error' => 'wp_insert_failed', 'mss_message' => rawurlencode($postId->get_error_message())), admin_url('admin.php')));
    exit;
  }

  wp_safe_redirect(add_query_arg(array('page' => 'mss-generator', 'mss_created' => intval($postId)), admin_url('admin.php')));
  exit;
}
add_action('admin_post_mss_generate', 'mss_handle_generate');
