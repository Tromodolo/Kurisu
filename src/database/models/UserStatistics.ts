import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

/* tslint:disable:member-access variable-name */

@Entity()
export class UserStatistics {
	@PrimaryGeneratedColumn()
	id: number;

	@Index()
	@Column({ default: 0 })
	totalMessages?: number;

	@Index()
	@Column({ default: 0 })
	commandsUsed?: number;
}