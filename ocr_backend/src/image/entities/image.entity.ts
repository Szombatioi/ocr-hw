import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ImageEntity {
    @PrimaryColumn()
    url!: string;

    @Column({ default: '' })
    description!: string;
}