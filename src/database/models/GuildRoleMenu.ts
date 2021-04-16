import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Guild } from './Guild';
import { GuildRole } from './GuildRole';

/* tslint:disable:member-access variable-name */

@Entity()
export class GuildRoleMenu {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	menuName: string;

	@Column()
	activeMessageId: string;

	@Column()
	activeChannelId: string;

	@ManyToOne((type) => Guild, (guild) => guild.roleMenus)
	guild: Guild;

	@OneToMany((type) => GuildRole, (role) => role.menu, {cascade: true})
	roles: GuildRole[];
}