import { Injectable } from '@nestjs/common';

@Injectable()
export class OcrService {
  async parseImageUrl(imageUrl: string): Promise<Record<string, unknown>> {
    const apiKey = process.env.OCR_API_KEY;
    const url = `https://api.ocr.space/parse/imageurl?apikey=${apiKey}&url=${encodeURIComponent(imageUrl)}&isOverlayRequired=true`;
    const res = await fetch(url);
    const data = (await res.json()) as Record<string, unknown>;
    return data;
  }
}
