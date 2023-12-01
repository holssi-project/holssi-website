interface TextInputProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  validate?: (text: string) => boolean;
}

export default function TextInput({ value, onChange, placeholder, validate }: TextInputProps) {

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (validate && !validate(e.target.value)) return;
    onChange(e.target.value);
  }

  return (
    <input type="text" value={value} onChange={handleChange} placeholder={placeholder}
      className="w-full p-1 rounded-md border border-emerald-500 font-body text-emerald-500 outline-none text-base placeholder:text-emerald-500/30" 
    />
  )
}