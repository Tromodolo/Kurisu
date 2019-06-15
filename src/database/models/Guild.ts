import { Entity, Column, PrimaryGeneratedColumn, Index, OneToOne, JoinColumn, ManyToMany, JoinTable, OneToMany, PrimaryColumn, Unique } from 'typeorm';
import { UserLevel } from './UserLevel';
import { User } from './User';
import { GuildConfig } from './GuildConfig';

/* tslint:disable:member-access variable-name */

@Entity()
export class Guild {
	@Index()
	@PrimaryColumn()
	@Column("varchar", {unique: true, nullable: false})
	id!: string;

	@Column("varchar")
	name!: string;

	@Column("varchar")
	avatarURL!: string;

	@OneToMany((type) => GuildConfig, (config) => config.guild)
	configs!: GuildConfig[];

	@ManyToMany((type) => User)
	@JoinTable()
	userList!: User[];

}