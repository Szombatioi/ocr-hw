import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';

interface NotifyDto {
  event: string;
  payload: unknown;
}

@Controller()
export class AppController {
  constructor(private readonly gateway: AppGateway) { }

  @Post()
  @HttpCode(200)
  notify(@Body() dto: NotifyDto) {
    this.gateway.broadcast(dto.event, dto.payload); //TODO
  }
}