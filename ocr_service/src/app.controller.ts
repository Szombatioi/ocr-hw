import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka } from '@nestjs/microservices/client/client-kafka';
import { Payload } from '@nestjs/microservices/decorators/payload.decorator';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('KAFKA_PRODUCER') private readonly kafka: ClientKafka,
  ) {}

  @EventPattern('image.uploaded')
  async handleImageUploaded(@Payload() message: { url: string }) {
    //Call OCR Space API

    
    this.kafka.emit('image.processed', {
      //... formátum megadása
    });
  }
}
