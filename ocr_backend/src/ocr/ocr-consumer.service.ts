import { Injectable } from '@nestjs/common';
import { ImageService } from 'src/image/image.service';

interface OcrCompletedPayload {
  url: string;
  name: string;
  description: string;
  createdAt: string;
  ocrResult: Record<string, any>;
}

@Injectable()
export class OcrConsumerService {
  constructor(private readonly imageService: ImageService) {}

  async handleOcrCompleted(payload: OcrCompletedPayload): Promise<void> {
    console.log("New OCR result: ", payload.ocrResult);
    await this.imageService.updateOcrResult(payload.url, payload.ocrResult);

    const wsGatewayUrl =
      process.env.WS_GATEWAY_URL ?? 'http://localhost:3002';

    await fetch(`${wsGatewayUrl}/push`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch((err) =>
      console.error('Failed to notify WS Gateway:', err?.message),
    );
  }
}
