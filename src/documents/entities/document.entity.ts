import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum DocumentStatus {
  Pending = 'pending',
  Processing = 'processing',
  Complete = 'complete',
  Failed = 'failed',
}

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  uploaderId: number;

  @Column({ type: 'enum', enum: DocumentStatus, default: DocumentStatus.Pending })
  status: DocumentStatus;

  @Column({ nullable: true })
  errorMessage?: string;
}
