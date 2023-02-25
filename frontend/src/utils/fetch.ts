export interface Project {
    uid: string,
    status: string,
    entry_name: string,
    executable_name: string | null,
    created: string,
}

export enum UploadType {
  ENTRY = "entry",
}
export interface UploadFileData {
  file: File;
  type: UploadType;
}
export async function createAndUpload(data: UploadFileData): Promise<Project> {
  const formData = new FormData();
  formData.append("file", data.file);

  const result = fetchForm<Project>(`/create`, formData);

  return result;
}

export interface BuildData {
  uid: string;
  name: string;
  nameEn: string;
  author: string;
  version: string;
  desc: string;
}
export async function runBuild(data: BuildData): Promise<Project> {

  const result = await fetchJSON<unknown, Project>('/build', data);

  return result;
}

async function fetcher<T>(key: string, body: RequestInit): Promise<T> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${key}`, body);

  if (res.status !== 200) {
    throw new Error(`Fetch Error: ${res.status} / ${res.statusText} / ${await res.text()}`);
  }

  const result = await res.json();
  return result;
}
async function fetchForm<T>(key: string, formData: FormData): Promise<T> {
  return fetcher<T>(key, {
    method: "POST",
    body: formData,
  })
}
async function fetchJSON<U, T>(key: string, data: U): Promise<T> {
  return fetcher<T>(key, {
    method: "POST",
    body: JSON.stringify(data),
  })
}