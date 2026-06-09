type MetricCardProps = {
  label: string
  value: string
  detail: string
}

export default function MetricCard({ label, value, detail }: MetricCardProps) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_16px_60px_rgba(8,15,35,0.18)] backdrop-blur">
      <p className="text-xs uppercase tracking-[0.24em] text-white/55">{label}</p>
      <p className="mt-3 font-serif text-3xl text-white">{value}</p>
      <p className="mt-2 text-sm text-white/70">{detail}</p>
    </div>
  )
}
