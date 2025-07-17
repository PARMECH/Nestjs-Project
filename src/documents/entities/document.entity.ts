import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  uploaderId: number;

  @Column({ default: 'pending' })
  status: 'pending' | 'processing' | 'complete' | 'failed';

  @Column({ nullable: true })
  errorMessage: string;
}
