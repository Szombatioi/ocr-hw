import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices/client/client-kafka';
import { Payload } from '@nestjs/microservices/decorators/payload.decorator';
import { EventPattern } from '@nestjs/microservices';

interface ImageType {
    url: string;
    name: string;
    description: string;
    createdAt: Date;
    ocrResult: Record<string, any> | null;
};

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(
    @Inject('KAFKA_PRODUCER') private readonly kafka: ClientKafka,
  ) {}

  @EventPattern('image.uploaded')
  async handleImageUploaded(@Payload() message: ImageType) {
    this.logger.log("Handling image uploaded event: " + message.url);
    //Call OCR Space API
    const apiKey = process.env.OCR_API_KEY;
    const url = `https://api.ocr.space/parse/imageurl?apikey=${apiKey}&url=${encodeURIComponent(message.url)}&isOverlayRequired=true`;
    const res = await fetch(url);
    const data = (await res.json()) as Record<string, unknown>;
    
    this.logger.log("OCR result for " + message.url + ": " + JSON.stringify(data));
    this.kafka.emit('image.processed', {
      ...message,
      ocrResult: data
    });
  }
}
