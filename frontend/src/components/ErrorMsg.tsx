import { useRouter } from "next/router";

interface Props {
  error: string;
}
export default function ErrorMsg({ error }: Props) {
  const router = useRouter();
  const { id } = router.query;
  const project_id = id as string;

  return (
    <div className="flex items-center">
      { error ? <div className="text-red-500">오류: {error} ({project_id})</div> : <></>}
    </div>
  )
}