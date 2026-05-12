import { Module } from '@nestjs/common';
import { ImageGateway } from './image.gateway';
import { PushController } from './push.controller';

@Module({
  providers: [ImageGateway],
  controllers: [PushController],
  exports: [ImageGateway],
})
export class GatewayModule {}
