'use client'

import AdfitAd from "@/components/AdfitAd";
import Loading from "@/components/Loading";
import PageTitle from "@/components/PageTitle";
import { useProjectStatus } from "@/utils/hooks";
import { useEffect } from "react";

export type Target = "win64" | "mac_intel" | "mac_arm";

interface WaitingProps {
  next: () => void;
  projectId: string
}

export default function Waiting({ projectId, next }: WaitingProps) {
  const [status, error] = useProjectStatus(projectId, true)


  useEffect(() => {
    if (status === "Success" || status === "Failed" || error !== "") {
      next();
    }
  }, [status, next, error])

  return (
    <>
      <div className="flex flex-col gap-6">
        <PageTitle title="실행 파일 만드는 중..." desc="열심히 실행 파일을 만들고 있어요! 잠시만 기다려주세요. 대략 10분이 소요됩니다." />
      </div>
      <div className="flex justify-center items-center w-full">
        <Loading size={64} />
      </div>
      <div>
        <AdfitAd type={2} />
      </div>
    </>
  )
}