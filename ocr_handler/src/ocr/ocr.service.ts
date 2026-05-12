import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ImageUploadedPayload, OcrCompletedPayload } from './types';

@Injectable()
export class OcrService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async processImage(payload: ImageUploadedPayload): Promise<void> {
    const ocrResult = await this.callOcrApi(payload.url);

    const completed: OcrCompletedPayload = { ...payload, ocrResult };
    this.kafkaClient.emit('ocr.completed', completed);

  }

  private async callOcrApi(imageUrl: string): Promise<Record<string, unknown>> {
    const imageRes = await fetch(imageUrl);
    const imageBuffer = await imageRes.arrayBuffer();

    const filename = imageUrl.split('/').pop() ?? 'image';
    const contentType = imageRes.headers.get('content-type') ?? 'image/png';

    const form = new FormData();
    form.append('apikey', process.env.OCR_API_KEY ?? '');
    form.append('isOverlayRequired', 'true');
    form.append('file', new Blob([imageBuffer], { type: contentType }), filename);

    const res = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: form,
    });
    if (res.status !== 200) return {};
    return res.json() as Promise<Record<string, unknown>>;
  }
}
