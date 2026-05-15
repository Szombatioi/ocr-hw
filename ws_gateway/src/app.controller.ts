import { Body, Controller, Get, HttpCode, Logger, Post } from '@nestjs/common';
import { AppGateway } from './app.gateway';

interface NotifyDto {
  event: string;
  payload: unknown;
}

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private readonly gateway: AppGateway) {}

  @Post()
  @HttpCode(200)
  notify(@Body() dto: NotifyDto) {
    this.logger.log(
      `Received notify request: event=${dto.event}, payload=${JSON.stringify(dto.payload)}`,
    );
    this.gateway.broadcast(dto.event, dto.payload); //TODO
  }

  @Get('health')
  health() {
    return { status: 'ok' };
  }
}
