export enum UploadType {
  ENTRY = "entry",
}
export interface UploadFileData {
  file: File;
  type: UploadType;
}
export async function uploadFile(data: UploadFileData) {
  const formData = new FormData();
  formData.append("file", data.file);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/${data.type}`, {
    method: "POST",
    body: formData,
  });
  const result = await res.json();
  return result;
}

export interface BuildData {
  id: string;
  name: string;
  nameEn: string;
  author: string;
  version: string;
  desc: string;
}
export async function runBuild(data: BuildData) {
  const formData = new FormData();
  formData.append("id", data.id);
  formData.append("name", data.name);
  formData.append("name_en", data.nameEn);
  formData.append("author", data.author);
  formData.append("version", data.version);
  formData.append("desc", data.desc);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/build`, {
    method: "POST",
    body: formData,
  });
  const result = await res.json();
  return result;
}