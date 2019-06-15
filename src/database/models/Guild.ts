import { Entity, Column, PrimaryGeneratedColumn, Index, OneToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { UserLevel } from './UserLevel';
import { User } from './User';
import { GuildConfig } from './GuildConfig';

/* tslint:disable:member-access variable-name */

@Entity()
export class Guild {
	@PrimaryGeneratedColumn()
	id!: number;

	@Index()
	@Column({ type: "varchar" })
	nativeId!: string;

	@OneToOne((type) => GuildConfig, {cascade: true})
	@JoinColumn()
	config!: string;

	@ManyToMany((type) => User)
	@JoinTable()
	userList!: User[];

}