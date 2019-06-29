import { Entity, Column, PrimaryGeneratedColumn, Index, OneToOne, JoinColumn } from 'typeorm';
import { UserAchievement } from './UserAchievement';

/* tslint:disable:member-access variable-name */

@Entity()
export class UserProfile {
	@PrimaryGeneratedColumn()
	id!: number;

	@Index()
	@Column({ type: "varchar", default: "This user does not have anything to say about themselves.", length: 256 })
	description!: string;

	@OneToOne((type) => UserAchievement, {eager: true})
	@JoinColumn()
	equippedAchievement!: UserAchievement;

	@Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
	lastUpdated!: Date;
}