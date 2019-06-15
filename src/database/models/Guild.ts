import { Entity, Column, PrimaryGeneratedColumn, Index, OneToOne, JoinColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
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

	@Column({ type: "varchar" })
	name!: string;

	@Column({ type: "varchar" })
	avatarURL!: string;

	@OneToMany((type) => GuildConfig, (config) => config.guild)
	configs!: GuildConfig[];

	@ManyToMany((type) => User)
	@JoinTable()
	userList!: User[];

}