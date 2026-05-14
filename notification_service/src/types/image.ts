import { OcrResult } from './ocr-result';

export interface ImageType {
  url: string;
  name: string;
  description: string;
  createdAt: Date;
  ocrResult: OcrResult | null;
}
