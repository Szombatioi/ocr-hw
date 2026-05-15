import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: `ocr-service-${process.env.HOSTNAME || 'local'}`,
        brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
      },
      consumer: { groupId: 'ocr-handler-group' },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3004);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
