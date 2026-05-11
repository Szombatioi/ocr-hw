import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { S3StorageModule } from 'src/s3-storage/s3-storage.module';
import { ImageEntity } from './entities/image.entity';

@Module({
  imports: [
    S3StorageModule,
    TypeOrmModule.forFeature([ImageEntity]),
  ],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule { }
