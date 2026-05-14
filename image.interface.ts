export interface ImageType {
    url: string;
    name: string;
    description: string;
    createdAt: Date;
    ocrResult: Record<string, any> | null;
};