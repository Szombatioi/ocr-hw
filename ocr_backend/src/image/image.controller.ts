import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateImageDto } from './dto/create-image.dto';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@Body() createImageDto: CreateImageDto, @UploadedFile() file: Express.Multer.File) {
    return this.imageService.createImage(file, createImageDto);
  }
  }
