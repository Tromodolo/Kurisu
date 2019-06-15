import { Entity, Column, PrimaryGeneratedColumn, Index, OneToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { UserLevel } from './UserLevel';
import { User } from './User';

/* tslint:disable:member-access variable-name */

@Entity()
export class GuildConfig {
	@PrimaryGeneratedColumn()
	id!: number;
}