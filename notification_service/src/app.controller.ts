import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Payload } from '@nestjs/microservices/decorators/payload.decorator';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('image.uploaded')
  handleImageUploaded(@Payload() message: { url: string; name: string, uploadedAt: string }) {
    //...
  }
}
