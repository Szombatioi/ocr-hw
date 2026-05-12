import { OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ImageUploadedPayload } from './types';
export declare class OcrService implements OnModuleInit {
    private readonly kafkaClient;
    constructor(kafkaClient: ClientKafka);
    onModuleInit(): Promise<void>;
    processImage(payload: ImageUploadedPayload): Promise<void>;
    private callOcrApi;
}
