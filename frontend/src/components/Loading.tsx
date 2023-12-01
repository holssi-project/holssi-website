import { Coffee } from "react-feather";

interface LoadingProps {
  className?: string;
  size?: number;
}
export default function Loading({ className, size }: LoadingProps) {
  return (
    <div className="flex justify-center align-middle w-full h-full">
      <Coffee className={`${className} animate-bounce text-slate-400`} size={size} />
    </div>
  )
}