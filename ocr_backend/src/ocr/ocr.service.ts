import { Injectable } from '@nestjs/common';

@Injectable()
export class OcrService {
  async parseImageUrl(imageUrl: string) {
    const apiKey = process.env.OCR_API_KEY;
    console.log(apiKey)
    const url = `https://api.ocr.space/parse/imageurl?apikey=${apiKey}&url=${encodeURIComponent(imageUrl)}&isOverlayRequired=true`;
    const res = await fetch(url);
    return res.json();
  }
}
