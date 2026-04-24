import api from "@/app/axios";
import { OcrResult } from "@/types/ocr-result";

export async function runOcr(imageUrl: string): Promise<OcrResult> {
  const response = await api.get<OcrResult>("/ocr", {
    params: { url: imageUrl },
  });
  return response.data;
}
