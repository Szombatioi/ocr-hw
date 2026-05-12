export interface ImageUploadedPayload {
    url: string;
    name: string;
    description: string;
    createdAt: string;
}
export interface OcrCompletedPayload extends ImageUploadedPayload {
    ocrResult: Record<string, unknown>;
}
