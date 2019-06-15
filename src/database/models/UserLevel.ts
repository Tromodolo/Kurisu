import { Entity, Column, PrimaryGeneratedColumn, Index, OneToOne, JoinColumn } from 'typeorm';

/* tslint:disable:member-access variable-name */

@Entity()
export class UserLevel {
	@PrimaryGeneratedColumn()
	id!: number;

	@Index()
	@Column({ type: "integer", default: 0 })
	total!: number;
}