import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

/* tslint:disable:member-access variable-name */

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id!: number;

	@Index()
	@Column({ type: "string" })
	userid!: string;
}