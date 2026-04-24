import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

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
  uploadImage(@Body() createImageDto: CreateImageDto, @UploadedFile() file: Express.Multer.File) {
    return this.imageService.createImage(file, createImageDto);
  }
}
