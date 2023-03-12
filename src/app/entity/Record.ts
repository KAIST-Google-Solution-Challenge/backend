import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Feedback } from '../models/feedback.enum';

@Entity()
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  deviceId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP()' })
  createdAt: Date;

  @Column({ length: 11 })
  phoneNumber: string;

  @Column({ type: 'enum', enum: Feedback, default: Feedback.UNKNOWN })
  feedback: Feedback;

  @Column({ type: 'decimal', precision: 3, scale: 3 })
  probability: number;

  @Column()
  url: string;
}
