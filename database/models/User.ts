import { AllowNull, AutoIncrement, BelongsTo, BelongsToMany, Column,
	 	 DataType, DefaultScope, ForeignKey, HasOne, Model, PrimaryKey, Table} from 'sequelize-typescript';

import { Guild } from './Guild';
import { GuildUser } from "./GuildUser";
import { UserLevel } from "./UserLevel";

@DefaultScope({
	attributes: ['userid', 'username', 'discriminator'],
})
@Table
export class User extends Model<User> {

	@PrimaryKey
	@AllowNull(false)
	@Column(DataType.STRING(32))
	public userid!: string;

	@AllowNull(false)
	@Column(DataType.STRING(32))
	public username!: string;

	@AllowNull(false)
	@Column(DataType.STRING(5))
	public discriminator!: string;

	@HasOne(() => UserLevel)
	public userlevel!: UserLevel;

	@BelongsToMany(() => Guild, () => GuildUser)
	public guilds: Guild[] = [];
}