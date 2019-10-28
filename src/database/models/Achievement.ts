import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

/* tslint:disable:member-access variable-name */

@Entity()
export class Achievement {
	@PrimaryGeneratedColumn()
	@Index()
	@Column({primary: true})
	id: number;

	@Column()
	name: string;

	@Column()
	title: string;

	@Column()
	description: string;

	@Column()
	showDescription: boolean;

	@Column()
	hidden: boolean;
}