import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices/enums/transport.enum';
import { MicroserviceOptions } from '@nestjs/microservices/interfaces/microservice-configuration.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(
    process.env.ENABLED_ORIGINS?.split(',') || 'http://localhost:3000',
  );

  //Configure Kafka microservice: makes the project a hybrid app
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: `backend-consumer-${process.env.HOSTNAME || 'local'}`,
        brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
      },
      consumer: { groupId: 'backend-group' },
    },
  });

  await app.startAllMicroservices(); // Start Kafka
  await app.listen(process.env.PORT ?? 3001); //Start REST API
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
