import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { EventPattern } from '@nestjs/microservices/decorators/event-pattern.decorator';
import { Payload } from '@nestjs/microservices/decorators/payload.decorator';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) { }

  @Get()
  findAll() {
    return this.imageService.findAll();
  }

  @Patch()
  updateOcrResult(@Body() dto: UpdateImageDto) {
    return this.imageService.updateOcrResult(dto.url, dto.ocrResult);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @Body() createImageDto: CreateImageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.imageService.createImage(file, createImageDto);
  }

  @EventPattern('image.processed')
  async handleImageProcessed(
    @Payload() message: { url: string; ocrResult: Record<string, any> },
  ) {
    await this.imageService.updateOcrResult(message.url, message.ocrResult);
  }
}
