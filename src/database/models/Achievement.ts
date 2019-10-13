import { Entity, Column, PrimaryGeneratedColumn, Index, OneToOne, JoinColumn, ManyToMany, JoinTable, PrimaryColumn } from 'typeorm';
import { UserLevel } from './UserLevel';
import { Guild } from './Guild';
import { UserProfile } from './UserProfile';

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