import { Entity, Column, PrimaryGeneratedColumn, Index, OneToOne, JoinColumn, ManyToMany, JoinTable, PrimaryColumn, OneToMany } from 'typeorm';
import { UserLevel } from './UserLevel';
import { Guild } from './Guild';
import { UserProfile } from './UserProfile';
import { UserAchievement } from './UserAchievement';

/* tslint:disable:member-access variable-name */

@Entity()
export class User {
	@Index()
	@Column({primary: true})
	id: string;

	@OneToOne((type) => UserLevel, {cascade: true, eager: true})
	@JoinColumn()
	experience: UserLevel;

	@OneToOne((type) => UserProfile, {cascade: true, eager: true})
	@JoinColumn()
	profile: UserProfile;

	@ManyToMany((type) => Guild, {cascade: true, eager: true})
	@JoinTable()
	guilds: Guild[];

	constructor(){
		this.experience = new UserLevel();
		this.profile = new UserProfile();
	}

	checkForMissing(){
		if (!this.experience){
			this.experience = new UserLevel();
		}
		if (!this.profile){
			this.profile = new UserProfile();
		}
		return this;
	}
}