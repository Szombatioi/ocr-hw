import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { S3StorageModule } from './s3-storage/s3-storage.module';
import { ImageModule } from './image/image.module';
import { OcrModule } from './ocr/ocr.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST', 'localhost'),
        port: configService.get<number>('DATABASE_PORT', 5432),
        username: configService.get<string>('DATABASE_USER', 'ocr'),
        password: configService.get<string>('DATABASE_PASS', 'ocr'),
        database: configService.get<string>('DATABASE_NAME', 'ocr_dev'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    ImageModule,
    S3StorageModule,
    OcrModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
