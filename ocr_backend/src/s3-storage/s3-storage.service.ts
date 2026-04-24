import { Injectable, InternalServerErrorException, Logger, OnModuleInit } from '@nestjs/common';
import { Client } from 'minio';
import * as path from 'path';
import * as stream from 'stream';

@Injectable()
export class S3StorageService implements OnModuleInit {
  public readonly bucket = 'images';
  private readonly minioClient: Client;

  constructor() {
    this.minioClient = new Client({
      endPoint: process.env.S3_ENDPOINT || 'localhost',
      port: Number(process.env.S3_PORT) || 9000,
      useSSL: false,
      accessKey: process.env.S3_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.S3_SECRET_KEY || 'minioadmin',
    });
  }

  async onModuleInit() {
    const exists = await this.minioClient.bucketExists(this.bucket).catch(() => false);
    if (!exists) {
      await this.minioClient.makeBucket(this.bucket);
    }
  }

  async uploadObject(file: Express.Multer.File) {
    const objectName = `${Date.now()}-${path.basename(file.originalname)}`; //Creating unique object name

    try {
      //uploading object
      await this.minioClient.putObject(
        this.bucket,
        objectName,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,
        },
      );

      return {
        filename: objectName,
        url: `${process.env.S3_PUBLIC_URL || 'http://localhost:9000'}/${this.bucket}/${objectName}`,
      };
    } catch (err) {
      throw new InternalServerErrorException('Failed to upload file');
    }
  }


  //Download any kind of object
  async downloadObject(objectName: string): Promise<stream.Readable> {
    try {
      //Fetching object - throws error if not found
      const stat = await this.minioClient.statObject(this.bucket, objectName);
      return await this.minioClient.getObject(this.bucket, objectName);
    } catch (err) {
      throw new InternalServerErrorException('Failed to download file');
    }
  }

  //Deletes a specific object
  async deleteObject(objectName: string): Promise<void> {
    try {
      //Deleting object
      const sanitizedObjectName = path.basename(objectName);
      await this.minioClient.removeObject(this.bucket, sanitizedObjectName);
    } catch (err) {
      throw new InternalServerErrorException('Failed to delete file');
    }
  }
}
