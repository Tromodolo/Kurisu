import { Entity, Column, PrimaryGeneratedColumn, Index, OneToOne, JoinColumn } from 'typeorm';

/* tslint:disable:member-access variable-name */

@Entity()
export class UserLevel {
	@PrimaryGeneratedColumn()
	id!: number;

	@Index()
	@Column({ default: 0 })
	total!: number;

	@Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
	lastUpdated!: Date;

}