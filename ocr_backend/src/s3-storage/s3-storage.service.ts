import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { Client } from 'minio';
import * as path from 'path';
import * as stream from 'stream';

@Injectable()
export class S3StorageService implements OnModuleInit {
  public readonly bucket = 'images';
  private readonly minioClient: Client;

  constructor() {
    const port = process.env.S3_PORT ? Number(process.env.S3_PORT) : undefined;
    const useSSL = process.env.S3_USE_SSL === 'true';

    this.minioClient = new Client({
      endPoint: process.env.S3_ENDPOINT || 'localhost',
      // omit port for default SSL (443) — including it breaks SigV4 with R2/S3
      ...((port && !(useSSL && port === 443)) ? { port } : {}),
      useSSL,
      accessKey: process.env.S3_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.S3_SECRET_KEY || 'minioadmin',
      region: 'auto',
    });
  }

  async onModuleInit() {
    // const exists = await this.minioClient.bucketExists(this.bucket).catch(() => false);
    // if (!exists) {
    //   await this.minioClient.makeBucket(this.bucket);
    // }

    // await this.minioClient.setBucketPolicy(
    //   this.bucket,
    //   JSON.stringify({
    //     Version: '2012-10-17',
    //     Statement: [
    //       {
    //         Effect: 'Allow',
    //         Principal: { AWS: ['*'] },
    //         Action: ['s3:GetObject'],
    //         Resource: [`arn:aws:s3:::${this.bucket}/*`],
    //       },
    //     ],
    //   }),
    // );
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
        url: `${process.env.S3_PUBLIC_URL || `http://localhost:9000/${this.bucket}`}/${objectName}`,
      };
    } catch (err) {
      console.error('uploadObject error:', err);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  //Download any kind of object
  async downloadObject(objectName: string): Promise<stream.Readable> {
    try {
      //Fetching object - throws error if not found
      // const stat = await this.minioClient.statObject(this.bucket, objectName);
      return await this.minioClient.getObject(this.bucket, objectName);
    } catch (err) {
      console.error('downloadObject error:', err);
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
      console.error(err);
      throw new InternalServerErrorException('Failed to delete file');
    }
  }
}
