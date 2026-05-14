import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Payload } from '@nestjs/microservices/decorators/payload.decorator';
import { EventPattern } from '@nestjs/microservices';
import { SubscriberService } from './subscriber/subscriber.service';
import type { ImageType } from './types/image';

@Controller()
export class AppController {
  constructor(private readonly subscriberService: SubscriberService) { }

  @EventPattern('image.processed')
  handleImageProcessed(@Payload() message: ImageType) {
    this.subscriberService.notifySubscribers(message);
  }

  @Post('subscribe')
  async subscribe(@Body() body: { email: string }) {
    return this.subscriberService.subscribe(body.email);
  }

  @Delete('subscribe')
  async unsubscribe(@Body() body: { email: string }) {
    await this.subscriberService.unsubscribe(body.email);
    return { ok: true };
  }
}
