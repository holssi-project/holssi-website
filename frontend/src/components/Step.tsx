interface Props {
  num: number;
  title: string;
  disabled?: boolean;
}

function Step({ num, title, disabled }: Props) {
  return (
    <div className="flex items-center my-6">
      <div className={`text-2xl w-8 h-8 rounded-full flex items-center justify-center font-medium ${disabled ? "border-2 border-emerald-500/50 text-emerald-500/50" : "bg-emerald-500 text-white"}`}>{num}</div>
      <div className={`text-2xl font-medium ml-3 ${disabled ? "text-gray-900/20" : "text-slate-900"}`}>{title}</div>
    </div>
  )
}

export default Step