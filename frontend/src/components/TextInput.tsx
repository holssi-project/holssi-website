interface Props {
  title: string;
  placeholder?: string;
  required?: boolean;
}
function TextInput({ title, placeholder, required }: Props) {
  return (
    <div className="border rounded-md border-slate-900/20 flex my-3 overflow-hidden flex-col sm:flex-row">
      <label className="font-medium text-lg py-1 px-3 w-32">{title}{required ? <span className="text-red-400">*</span> : ''}</label>
      <input type="text" className="outline-none py-1 px-3 flex-1 border-t sm:border-l sm:border-t-0 border-slate-900/20 rounded-none" placeholder={placeholder} />
    </div>
  )
}

export default TextInput