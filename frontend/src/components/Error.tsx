import { useAppSelector } from "@/store/hooks";

interface ErrorProps {
  msg: string;
  detail?: boolean;
}
export default function Error({ msg, detail }: ErrorProps) {
  const projectId = useAppSelector(state => state.project.project?.project_id);
  return (
    <div className="text-red-500 text-sm font-body">
      {detail ? `에러: ${msg} / ${projectId}` : msg}
    </div>
  )
}