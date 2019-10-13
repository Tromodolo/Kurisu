import { Entity, Column, PrimaryGeneratedColumn, Index, OneToOne, JoinColumn, ManyToMany, JoinTable, OneToMany, PrimaryColumn, Unique } from 'typeorm';
import { UserLevel } from './UserLevel';
import { User } from './User';
import { GuildConfig, ConfigFeature } from './GuildConfig';

/* tslint:disable:member-access variable-name */

@Entity()
export class Guild {
	@Index()
	@Column({primary: true, nullable: false})
	id: string;

	@Column()
	name: string;

	@Column()
	avatarURL: string;

	@OneToMany((type) => GuildConfig, (config) => config.guild, {cascade: true})
	configs: GuildConfig[];

	@ManyToMany((type) => User, {cascade: true})
	@JoinTable()
	userList: User[];
}