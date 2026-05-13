import { Inject, Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { S3StorageService } from 'src/s3-storage/s3-storage.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageEntity } from './entities/image.entity';
import { ClientKafka } from '@nestjs/microservices/client/client-kafka';

@Injectable()
export class ImageService {
  constructor(
    @Inject() private readonly s3StorageService: S3StorageService,
    @InjectRepository(ImageEntity) private readonly imageRepository: Repository<ImageEntity>,
    @Inject('KAFKA_PRODUCER') private readonly kafka: ClientKafka,

  ) { }
  async findAll(): Promise<ImageEntity[]> {
    return this.imageRepository.find();
  }

  async updateOcrResult(
    url: string,
    ocrResult: Record<string, any>,
  ): Promise<void> {
    await this.imageRepository.update({ url }, { ocrResult });
  }

  async createImage(
    file: Express.Multer.File,
    dto: CreateImageDto,
  ): Promise<string> {
    //Upload to the object-storage
    const result = await this.s3StorageService.uploadObject(file);

    //Save to the database
    await this.imageRepository.save(
      this.imageRepository.create({
        url: result.url,
        name: file.originalname,
        description: dto.description,
        createdAt: dto.createdAt || new Date(),
      }),
    );

    //publishing a Kafka message: image.uploaded
    //ocr-handler only needs the url, but we include the others since they may be useful for the notifications
    this.kafka.emit('image.uploaded', {
      url: result.url,
      name: file.originalname,
      uploadedAt: new Date().toISOString(),
    });

    //Return the URL - the OCR coordinates are not stored for now,
    //the client side will call the service
    return result.url;
  }
}
