import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ImageGateway } from './image.gateway';

@Controller()
export class PushController {
  constructor(private readonly gateway: ImageGateway) {}

  //This is what the ocr_backend will call via HTTP to notify the browsers of processed OCR results (and images)
  @Post('push')
  @HttpCode(204)
  push(@Body() image: unknown): void {
    this.gateway.broadcastImage(image);
  }
}
