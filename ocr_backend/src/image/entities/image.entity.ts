import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ImageEntity {
  @PrimaryColumn()
  url!: string;

  @Column({ default: '' })
  name!: string;

  @Column({ default: '' })
  description!: string;

  @Column()
  createdAt!: Date;

  @Column({ type: 'simple-json', nullable: true })
  ocrResult!: Record<string, any> | null;
}
