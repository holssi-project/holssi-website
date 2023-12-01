interface ButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function Button({ text, onClick, disabled }: ButtonProps) {
  return (
    <input type="button" value={text} onClick={onClick} disabled={disabled}
      className={`p-2 bg-emerald-500 rounded-xl w-full font-title text-lg text-white font-bold cursor-pointer ${disabled ? "bg-emerald-500/30" : "bg-emerald-500 hover:bg-emerald-500/75"}`}
    />
  )
}