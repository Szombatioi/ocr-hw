import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { OcrService } from './ocr.service';
import { ImageUploadedPayload } from './types';

@Controller()
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  @EventPattern('image.uploaded')
  async handleImageUploaded(@Payload() payload: ImageUploadedPayload) {
    await this.ocrService.processImage(payload);
  }
}
