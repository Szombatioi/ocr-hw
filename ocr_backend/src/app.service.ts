import { Inject, Injectable } from '@nestjs/common';
import { CreateImageDto } from './image/dto/create-image.dto';
import { S3StorageService } from './s3-storage/s3-storage.service';

@Injectable()
export class AppService {}
