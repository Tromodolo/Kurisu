import { Entity, Column, PrimaryGeneratedColumn, Index, OneToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { UserLevel } from './UserLevel';
import { Guild } from './Guild';

/* tslint:disable:member-access variable-name */

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id!: number;

	@Index()
	@Column({ type: "varchar" })
	userId!: string;

	@OneToOne((type) => UserLevel, {cascade: true})
	@JoinColumn()
	experience!: UserLevel;

	@ManyToMany((type) => Guild)
	@JoinTable()
	guilds!: Guild[];
}