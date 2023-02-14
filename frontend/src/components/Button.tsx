interface Props {
  title: string;
  outline?: boolean;
  onClick: () => void;
}
function Button({ title, outline, onClick }: Props) {
  return (
    <input type="button"
      className={`font-medium text-lg py-1 px-3 my-3 order rounded-md border border-emerald-500 ${outline ? "text-emerald-500 hover:bg-emerald-500/20" : "bg-emerald-500 text-white hover:bg-emerald-500/75"}`}
      value={title}
      onClick={onClick}
    />
  )
}

export default Button