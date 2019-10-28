import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { GuildConfig } from './GuildConfig';
import { GuildRoleMenu } from './GuildRoleMenu';
import { User } from './User';

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

	@OneToMany((type) => GuildRoleMenu, (menu) => menu.guild, {cascade: true})
	roleMenus: GuildRoleMenu[];

	@ManyToMany((type) => User, {cascade: true})
	@JoinTable()
	userList: User[];
}