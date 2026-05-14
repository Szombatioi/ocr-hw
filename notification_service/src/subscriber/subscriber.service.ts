import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriberEntity } from './entities/subscriber.entity';
import * as nodemailer from 'nodemailer';
import axios from 'axios';
import { OcrResult } from '../types/ocr-result';
import { ImageType } from '../types/image';

@Injectable()
export class SubscriberService {
  constructor(
    @InjectRepository(SubscriberEntity)
    private readonly subscriberRepository: Repository<SubscriberEntity>,
  ) { }

  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,  
    },
  });

  async sendMail(to: string | string[], subject: string, html: string) {
    await this.transporter.sendMail({
      from: `OCR Homework`,
      to,
      subject,
      html,
    });
  }

  async notifySubscribers(image: ImageType) {
    const subscribers = await this.findAll();
    if (subscribers.length === 0) return;

    const subject = `New image processed: ${image.name}`;
    const html = `
      <h1>${image.name}</h1>
      <p>Description: ${image.description}</p>
      <p>Created at: ${image.createdAt.toLocaleString()}</p>
      <p>OCR Result: ${this.extractOcrText(image.ocrResult)}</p>
    `;
    await this.sendMail(subscribers.map((s) => s.email), subject, html);
  }

  async findAll(): Promise<SubscriberEntity[]> {
    return this.subscriberRepository.find();
  }

  async subscribe(email: string): Promise<SubscriberEntity> {
    const existing = await this.subscriberRepository.findOneBy({ email });
    if (existing) {
      throw new ConflictException(`Email already subscribed: ${email}`);
    }
    const subscriber = await this.subscriberRepository.save(
      this.subscriberRepository.create({ email }),
    );

    // Backfill: get all existing images and send an email
    try {
      const { data: images } = await axios.get<ImageType[]>(
        `${process.env.BACKEND_URL}/image`,
      );
      await this.sendBackfillEmail(email, images);
    } catch (err) {
      console.error('Backfill failed:', err);
    }

    return subscriber;
  }

  async unsubscribe(email: string): Promise<void> {
    await this.subscriberRepository.delete({ email });
  }

  private async sendBackfillEmail(email: string, images: ImageType[]) {
    const html = `
    <h1>Welcome! Here are all the images uploaded so far:</h1>
    <ul>
      ${images.map(img => `
        <li>
          Name: <strong>${img.name}</strong><br/>
          Description: ${img.description}<br/>
          OCR: ${this.extractOcrText(img.ocrResult)}
        </li>
      `).join('')}
    </ul>
  `;
    await this.sendMail(email, 'Subscribed to OCR Updates', html);
    console.log(`Backfill email sent to ${email} with ${images.length} images`)
  }

  private extractOcrText(ocrResult: OcrResult | null): string {
    if (!ocrResult?.ParsedResults?.length) return '-';

    return ocrResult.ParsedResults
      .map((r) => r.ParsedText?.trim() ?? '')
      .filter((t) => t.length > 0)
      .join('\n');
  }
}
