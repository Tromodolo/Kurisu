import { Entity, Column, PrimaryGeneratedColumn, Index, OneToOne, JoinColumn, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { UserLevel } from './UserLevel';
import { User } from './User';
import { Guild } from './Guild';

/* tslint:disable:member-access variable-name */

@Entity()
export class GuildConfig {
	@PrimaryGeneratedColumn()
	id!: number;

	@ManyToOne((type) => Guild, (guild) => guild.configs, {cascade: true})
	guild!: Guild;

	@Column("int")
	configType!: ConfigFeature;

	@Column("boolean")
	enabled!: boolean;

	@Column("varchar")
	value!: string;
}

enum ConfigFeature{
	JoinLeaveNotification,
	KickBanNotification,
}