import { Entity, Column, PrimaryGeneratedColumn, Index, OneToOne, JoinColumn } from 'typeorm';
import { Achievement } from './Achievement';

/* tslint:disable:member-access variable-name */

@Entity()
export class UserAchievements {
	@PrimaryGeneratedColumn()
	id!: number;

	@OneToOne((type) => Achievement, {eager: true})
	@JoinColumn()
	achievement!: Achievement;
}