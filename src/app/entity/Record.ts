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

  @Column({ type: 'enum', enum: Feedback, default: Feedback.UNKNOWN })
  feedback: Feedback;

  @Column({ default: '' })
  url: string;

  @Column({ type: 'boolean', default: false })
  isHandled: boolean;
}
