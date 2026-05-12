import { Inject, Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { S3StorageService } from 'src/s3-storage/s3-storage.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageEntity } from './entities/image.entity';
import { KafkaProducerService } from 'src/kafka/kafka-producer.service';

@Injectable()
export class ImageService {
  constructor(
    @Inject() private readonly s3StorageService: S3StorageService,
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
    private readonly kafkaProducer: KafkaProducerService,
  ) {}

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
  ): Promise<void> {
    const result = await this.s3StorageService.uploadObject(file);
    const createdAt = dto.createdAt || new Date();

    await this.imageRepository.save(
      this.imageRepository.create({
        url: result.url,
        name: file.originalname,
        description: dto.description,
        createdAt,
      }),
    );

    this.kafkaProducer.emit('image.uploaded', {
      url: result.url,
      name: file.originalname,
      description: dto.description ?? '',
      createdAt: createdAt instanceof Date ? createdAt.toISOString() : createdAt,
    });
  }
}
