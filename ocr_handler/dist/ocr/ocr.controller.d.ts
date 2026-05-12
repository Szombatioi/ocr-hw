import { OcrService } from './ocr.service';
import { ImageUploadedPayload } from './types';
export declare class OcrController {
    private readonly ocrService;
    constructor(ocrService: OcrService);
    handleImageUploaded(payload: ImageUploadedPayload): Promise<void>;
}
