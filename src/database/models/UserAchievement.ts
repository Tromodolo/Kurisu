import { Entity, Column, PrimaryGeneratedColumn, Index, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Achievement } from './Achievement';
import { User } from './User';

/* tslint:disable:member-access variable-name */

@Entity()
export class UserAchievement {
	@PrimaryGeneratedColumn()
	@Index()
	id!: number;

	@ManyToOne((type) => User, (user) => user.id)
	user!: User;

	@OneToOne((type) => Achievement, {eager: true})
	@JoinColumn()
	achievement!: Achievement;
}