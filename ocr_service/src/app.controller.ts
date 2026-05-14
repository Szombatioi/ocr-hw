import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices/client/client-kafka';
import { Payload } from '@nestjs/microservices/decorators/payload.decorator';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(
    @Inject('KAFKA_PRODUCER') private readonly kafka: ClientKafka,
  ) {}

  @EventPattern('image.uploaded')
  async handleImageUploaded(@Payload() message: { imageUrl: string }) {
    this.logger.log("Handling image uploaded event: " + message.imageUrl);
    //Call OCR Space API
    const apiKey = process.env.OCR_API_KEY;
    const url = `https://api.ocr.space/parse/imageurl?apikey=${apiKey}&url=${encodeURIComponent(message.imageUrl)}&isOverlayRequired=true`;
    const res = await fetch(url);
    const data = (await res.json()) as Record<string, unknown>;
    
    this.logger.log("OCR result for " + message.imageUrl + ": " + JSON.stringify(data));
    this.kafka.emit('image.processed', {
      url: message.imageUrl,
      ocrResult: data
    });
  }
}
