import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { S3StorageService } from '../s3-storage/s3-storage.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageEntity } from './entities/image.entity';
import { ClientKafka } from '@nestjs/microservices/client/client-kafka';
import axios from 'axios';

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);
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
    this.logger.log(`Updating OCR result for ${url}`);
    this.logger.log(`OCR Result: ${JSON.stringify(ocrResult)}`);
    await this.imageRepository.update({ url }, { ocrResult });

    const updated = await this.imageRepository.findOneBy({ url });
    if (updated) {
      await this.notifyWsGateway('image.processed', updated);
    }
  }

  async createImage(
    file: Express.Multer.File,
    dto: CreateImageDto,
  ): Promise<string> {
    //Upload to the object-storage
    const result = await this.s3StorageService.uploadObject(file);

    //Save to the database
    const saved = await this.imageRepository.save(
      this.imageRepository.create({
        url: result.url,
        name: file.originalname,
        description: dto.description ?? '',
        createdAt: dto.createdAt || new Date(),
        ocrResult: null,
      }),
    );

    //We send an ImageEntity type to the Kafka topic
    this.kafka.emit('image.uploaded', saved);
    this.logger.log("Kafka message emitted for image upload: " + saved.url);

    //Return the URL - the OCR coordinates are not stored for now,
    //the client side will call the service
    return result.url;
  }

  private async notifyWsGateway(event: string, payload: ImageEntity): Promise<void> {
    const wsGatewayUrl = process.env.WS_GATEWAY_URL || 'http://localhost:3002';
    try {
      await axios.post(wsGatewayUrl, {
        event,
        payload,
      });
    } catch (err: any) {
      console.error(`WebSocket Gateway error: ${err.message}`);
    }
  }
}
