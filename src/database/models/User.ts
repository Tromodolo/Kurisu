import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, OneToOne } from 'typeorm';
import { Guild } from './Guild';
import { UserLevel } from './UserLevel';
import { UserProfile } from './UserProfile';

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