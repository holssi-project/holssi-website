import { Loader } from "react-feather";

interface Props {
  className?: string;
}
export default function Loading({ className }: Props) {
  return (
    <div className="flex justify-center align-middle w-full h-full">
      <Loader className={`${className} animate-spin text-slate-900/30`} />
    </div>
  )
}