import { AllowNull, AutoIncrement, BelongsTo, Column, DataType, DefaultScope,
		 ForeignKey, HasMany, Model, NotNull, PrimaryKey, Table } from 'sequelize-typescript';
import { Guild } from './Guild';

@DefaultScope({
attributes: ['commandguildpair', 'guildid', 'commandname', 'commandtext'],
})
@Table
export class CustomCommands extends Model<CustomCommands> {

	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	public commandguildpair!: number;

	@AllowNull(false)
	@ForeignKey(() => Guild)
	@Column(DataType.STRING(32))
	public guildid!: string;

	@AllowNull(false)
	@Column(DataType.STRING(20))
	public commandname!: string;

	@AllowNull(false)
	@Column(DataType.STRING(500))
	public commandtext!: string;

	@BelongsTo(() => Guild)
	public guild!: Guild;
}