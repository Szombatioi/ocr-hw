import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { OcrConsumerService } from './ocr-consumer.service';

interface OcrCompletedPayload {
  url: string;
  name: string;
  description: string;
  createdAt: string;
  ocrResult: Record<string, any>;
}

@Controller()
export class OcrConsumerController {
  constructor(private readonly ocrConsumerService: OcrConsumerService) {}

  @EventPattern('ocr.completed')
  async handleOcrCompleted(@Payload() payload: OcrCompletedPayload) {
    await this.ocrConsumerService.handleOcrCompleted(payload);
  }
}
