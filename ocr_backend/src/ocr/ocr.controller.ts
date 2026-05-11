import { Controller, Get, Query } from '@nestjs/common';
import { OcrService } from './ocr.service';

@Controller('ocr')
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  @Get()
  parse(@Query('url') imageUrl: string) {
    return this.ocrService.parseImageUrl(imageUrl);
  }
}
