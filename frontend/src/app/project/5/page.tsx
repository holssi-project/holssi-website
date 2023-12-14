"use client";

import AdfitAd from "@/components/AdfitAd";
import BottomContainer from "@/components/BottomContainer";
import Button from "@/components/Button";
import Error from "@/components/Error";
import PageTitle from "@/components/PageTitle";
import { useAppSelector } from "@/store/hooks";
import { download_url } from "@/utils/fetch";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type Target = "win64" | "mac_intel" | "mac_arm";

export default function Page() {
  const route = useRouter();
  const projectId = useAppSelector(state => state.project.project?.project_id);
  const projectStatus = useAppSelector(state => state.project.project?.status);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleDownloadClick() {
    if (!projectId) {
      setError("잘못된 접근입니다. 처음부터 다시 시도해주세요.")
      return;
    }
    setIsLoading(true);
    download_url(projectId)
      .then(d => window.open(d))
      .catch(err => setError(`${err}`))
      .finally(() => setIsLoading(false))
  }

  return (
    <>
      {
        projectStatus === "Success"
          ? (<>
            <div className="flex flex-col gap-6">
              <PageTitle title="실행 파일 다운로드" desc="실행 파일을 성공적으로 만들었어요! 아래 버튼을 통해 다운로드 해 주세요." />
            </div>
            <BottomContainer>
              <div className="mb-4">
                <AdfitAd type={0} />
              </div>
              <Button text="다운로드" onClick={handleDownloadClick} disabled={isLoading} />
              {error && <Error msg={error} detail />}
              <Link href="/" className="text-slate-500 text-sm font-body text-center">
                첫 페이지로 돌아가기
              </Link>
            </BottomContainer>
          </>)
          : (<>
            <div className="flex flex-col gap-6">
              <PageTitle title="에러 발생" desc="실행 파일을 만들던 중 문제가 발생했어요. 만약 계속해서 문제가 발생한다면 아래의 프로젝트ID를 포함하여 GitHub에 이슈를 생성해주세요." />
              <div className="text-slate-500 text-sm font-body">
                프로젝트 ID: {projectId}
              </div>
            </div>
            <BottomContainer>
              <Button text="첫 페이지로 돌아가기" onClick={() => route.push("/")} disabled={isLoading} />
            </BottomContainer>
          </>)
      }
    </>
  )
}