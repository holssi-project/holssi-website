import { useEffect, useState } from "react";
import { Project, ProjectStatus, status } from "./fetch";

export function useProjectStatus(projectId: string, update = false): [ProjectStatus | undefined, string] {
  const [project, setProject] = useState<Project>()
  const [error, setError] = useState<string>('')

  function updateProject() {
    status(projectId)
      .then(p => {
        setProject(p)
      })
      .catch(err => {
        setError(`${err}`)
      })
  }

  useEffect(() => {
    if (update) {
      const id = setInterval(updateProject, 1000 * 15)
      return () => clearInterval(id);
    } else {
      updateProject()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [project?.status, error]
}