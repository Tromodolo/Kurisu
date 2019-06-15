import { Entity, Column, PrimaryGeneratedColumn, Index, OneToOne, JoinColumn, ManyToMany, JoinTable, PrimaryColumn } from 'typeorm';
import { UserLevel } from './UserLevel';
import { Guild } from './Guild';

/* tslint:disable:member-access variable-name */

@Entity()
export class User {
	@Index()
	@PrimaryColumn()
	@Column("varchar")
	id!: string;

	@OneToOne((type) => UserLevel, {cascade: true})
	@JoinColumn()
	experience!: UserLevel;

	@ManyToMany((type) => Guild)
	@JoinTable()
	guilds!: Guild[];
}