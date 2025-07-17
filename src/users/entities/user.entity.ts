import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type UserRole = 'admin' | 'editor' | 'viewer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'viewer' })
  role: UserRole;
}
