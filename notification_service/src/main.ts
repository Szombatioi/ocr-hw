import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: `notification-service-${process.env.HOSTNAME || 'local'}`,
        brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
      },
      consumer: { groupId: 'notification-handler-group' },
    },
  });

  app.enableCors(
    [process.env.ENABLED_CORS_ORIGINS?.split(',') || 'http://localhost:3000']
  );

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3003);
}
bootstrap();