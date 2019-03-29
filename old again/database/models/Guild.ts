import { AllowNull, AutoIncrement, BelongsToMany, Column, DataType,
	 	 DefaultScope, ForeignKey, HasMany, Model, NotNull, PrimaryKey, Table } from 'sequelize-typescript';

import { CustomCommands } from './CustomCommands';
import { GuildUser } from "./GuildUser";
import { User } from './User';

@DefaultScope({
	attributes: ['guildid', 'name'],
})
@Table
export class Guild extends Model<Guild> {

	@PrimaryKey
	@AllowNull(false)
	@Column(DataType.STRING(32))
	public guildid!: string;

	@AllowNull(false)
	@Column(DataType.STRING(32))
	public name!: string;

	@HasMany(() => CustomCommands)
	public customcommands: CustomCommands[] = [];

	@BelongsToMany(() => User, () => GuildUser)
	public users: User[] = [];

/*
	@BelongsToMany(() => User, () => GuildUser)
	public users!: User[]; */
}