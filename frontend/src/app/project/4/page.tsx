'use client'

import AdfitAd from "@/components/AdfitAd";
import Loading from "@/components/Loading";
import PageTitle from "@/components/PageTitle";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateProject } from "@/store/projectSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export type Target = "win64" | "mac_intel" | "mac_arm";

export default function Page() {
  const route = useRouter();
  const dispatch = useAppDispatch();
  const project = useAppSelector(state => state.project.project);

  useEffect(() => {
    const id = setInterval(() => {
      dispatch(updateProject());
    }, 1000 * 15)
    return () => clearInterval(id);
  }, [dispatch]);

  useEffect(() => {
    if (project?.status === "Success" || project?.status === "Failed") {
      route.push(`./5`);
    } else if (!project) {
      route.push(`/`);
    }
  }, [project, route])

  return (
    <>
      <div className="flex flex-col gap-6">
        <PageTitle title="실행 파일 만드는 중..." desc="열심히 실행 파일을 만들고 있어요! 잠시만 기다려주세요. 대략 2~6분이 소요됩니다." />
      </div>
      <div className="flex justify-center items-center w-full">
        <Loading size={64} />
      </div>
      <div>
        <AdfitAd />
      </div>
    </>
  )
}