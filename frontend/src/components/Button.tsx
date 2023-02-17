interface Props {
  title: string;
  outline?: boolean;
  onClick: () => void;
  disabled?: boolean;
}
function Button({ title, outline, onClick, disabled }: Props) {
  return (
    <input type="button"
      className={`font-medium text-lg py-1 px-3 my-3
      rounded-md border border-emerald-500
      ${outline ? "text-emerald-500 hover:bg-emerald-500/20" : "bg-emerald-500 text-white hover:bg-emerald-500/75"}
      disabled:bg-emerald-500/50`}
      value={title}
      onClick={onClick}
      disabled={disabled}
    />
  )
}

export default Button