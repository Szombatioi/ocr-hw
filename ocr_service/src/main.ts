import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: `ocr-service-${process.env.HOSTNAME || 'local'}`,
        brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
      },
      consumer: { groupId: 'ocr-handler-group' },
    },
  });
  await app.listen();
}
bootstrap();
