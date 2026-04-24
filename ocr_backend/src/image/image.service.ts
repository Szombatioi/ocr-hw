import { Inject, Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { S3StorageService } from 'src/s3-storage/s3-storage.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageEntity } from './entities/image.entity';

@Injectable()
export class ImageService {
  constructor(
    @Inject() private readonly s3StorageService: S3StorageService,
    @InjectRepository(ImageEntity) private readonly imageRepository: Repository<ImageEntity>,
  ) {}
  async findAll(): Promise<ImageEntity[]> {
    return this.imageRepository.find();
  }

  async updateOcrResult(url: string, ocrResult: Record<string, any>): Promise<void> {
    await this.imageRepository.update({ url }, { ocrResult });
  }

  async createImage(file: Express.Multer.File, dto: CreateImageDto) {
    //Upload to the object-storage
    const result = await this.s3StorageService.uploadObject(file);

    //Save to the database
    await this.imageRepository.save(
      await this.imageRepository.create({
        url: result.url,
        name: file.originalname,
        description: dto.description,
        createdAt: dto.createdAt || new Date(),
      }),
    );

    //Return the URL - the OCR coordinates are not stored for now, 
    //the client side will call the service
    return result.url;
  }
}
