import { Entity, Column, PrimaryGeneratedColumn, Index, OneToOne, JoinColumn, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { UserLevel } from './UserLevel';
import { User } from './User';
import { Guild } from './Guild';

/* tslint:disable:member-access variable-name */

@Entity()
export class GuildConfig {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne((type) => Guild, (guild) => guild.configs)
	guild: Guild;

	@Column()
	configType: ConfigFeature;

	@Column()
	enabled: boolean;

	@Column()
	value: string;
}

export enum ConfigFeature{
	JoinLeaveNotification,
	KickBanNotification,
	EditMessageNotification,
	LevelUpMessage,
}