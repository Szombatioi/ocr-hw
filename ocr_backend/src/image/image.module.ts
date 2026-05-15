import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { S3StorageModule } from '../s3-storage/s3-storage.module';
import { ImageEntity } from './entities/image.entity';
import { Transport } from '@nestjs/microservices/enums/transport.enum';
import { ClientsModule } from '@nestjs/microservices/module/clients.module';

@Module({
  imports: [
    S3StorageModule,
    TypeOrmModule.forFeature([ImageEntity]),
    ClientsModule.register([
      {
        name: 'KAFKA_PRODUCER',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'backend',
            brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
          },
          producer: { allowAutoTopicCreation: false },
        },
      },
    ]),
  ],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
