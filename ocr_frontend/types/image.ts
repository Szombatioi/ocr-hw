import { OcrResult } from "./ocr-result";

export interface Image {
  url: string;
  name: string;
  description: string;
  createdAt: string;
  ocrResult: OcrResult | null;
}
