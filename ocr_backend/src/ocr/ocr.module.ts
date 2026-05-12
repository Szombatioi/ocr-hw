import { Module } from '@nestjs/common';
import { OcrConsumerController } from './ocr-consumer.controller';
import { OcrConsumerService } from './ocr-consumer.service';
import { ImageModule } from 'src/image/image.module';

@Module({
  imports: [ImageModule],
  controllers: [OcrConsumerController],
  providers: [OcrConsumerService],
})
export class OcrModule {}
