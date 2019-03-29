import { AutoIncrement, Column, DataType, DefaultScope,
		 ForeignKey, HasMany, Model, PrimaryKey, Table, NotNull, AllowNull} from 'sequelize-typescript';

import { Guild } from "./Guild";
import { User } from "./User";

@DefaultScope({
	attributes: ['guilduserpair', 'userid', 'guildid'],
})
@Table
export class GuildUser extends Model<GuildUser> {

	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	public guilduserpair!: number;

	@ForeignKey(() => User)
	@Column(DataType.STRING(32))
	public userid!: string;

	@ForeignKey(() => Guild)
	@Column(DataType.STRING(32))
	public guildid!: string;

/* 	@HasMany(() => Guild)
	public guilds!: Guild[];

	@HasMany(() => User)
	public users!: User[]; */
}