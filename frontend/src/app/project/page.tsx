"use client";

import Loading from "@/components/Loading";
import InputProjectInfo from "@/components/steps/InputProjectInfo";
import Result from "@/components/steps/Result";
import SelectOption from "@/components/steps/SelectOption";
import SelectProject from "@/components/steps/SelectProject";
import Waiting from "@/components/steps/Waiting";
import { ProjectStatus, status } from "@/utils/fetch";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams()
  const projectId = searchParams.get("id");
  const [projectStatus, setProjectStatus] = useState<ProjectStatus | "Uploaded_1" | "WaitingEnd">("Unknown");

  useEffect(() => {
    if (!projectId) return;
    status(projectId)
      .then(project => {
        setProjectStatus(project.status)
      })
      .catch(() => {
        setProjectStatus("Failed")
      });
  }, [projectId])

  useEffect(() => {
    window.scroll({
      top: 0,
    })
  }, [projectStatus])

  if (!projectId) {
    router.push('/');
    return;
  }

  switch (projectStatus) {
    case "Unknown":
      return (
        <div></div>
      )
    case "Created":
      return (
        <SelectProject projectId={projectId} next={() => setProjectStatus("Uploaded")} />
      )
    case "Uploaded":
      return (
        <InputProjectInfo next={() => setProjectStatus("Uploaded_1")} />
      )
    case "Uploaded_1":
      return (
        <SelectOption projectId={projectId} next={() => setProjectStatus("Building")} />
      )
    case "Building":
      return (
        <Waiting projectId={projectId} next={() => setProjectStatus("WaitingEnd")} />
      )
    case "WaitingEnd":
    case "Success":
    case "Failed":
      return (
        <Result projectId={projectId} />
      )
    default:
      break;
  }
}