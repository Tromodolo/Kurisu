import { AllowNull, AutoIncrement, BelongsTo, Column, DataType,
		 Default, DefaultScope, ForeignKey, HasOne, Model, PrimaryKey, Table} from 'sequelize-typescript';

import { User } from "./User";

@DefaultScope({
	attributes: ['usernumber', 'userid', 'totalexp'],
})
@Table
export class UserLevel extends Model<UserLevel> {

	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER.UNSIGNED)
	public usernumber!: number;

	@ForeignKey(() => User)
	@Column(DataType.STRING(32))
	public userid!: string;

	@AllowNull(false)
	@Default(0)
	@Column(DataType.INTEGER.UNSIGNED)
	public totalexp!: number;

	@BelongsTo(() => User)
	public user!: User;
}