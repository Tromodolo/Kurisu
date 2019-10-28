import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GuildRoleMenu } from './GuildRoleMenu';

/* tslint:disable:member-access variable-name */

@Entity()
export class GuildRole {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne((type) => GuildRoleMenu, (menu) => menu.roles)
	menu: GuildRoleMenu;

	@Column()
	roleId: string;

	@Column()
	roleName: string;

	@Column()
	emoji: string;
}