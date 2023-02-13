import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Record {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	deviceId: string;

	@Column()
	createdAt: Date;

	@Column()
	feedback: string;

	@Column()
	url: string;

	@Column()
	isHandled: boolean;
}
