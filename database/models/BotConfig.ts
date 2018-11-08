import { AllowNull, AutoIncrement, Column, DataType, DefaultScope,
		 ForeignKey, HasMany, Model, NotNull, PrimaryKey, Table} from 'sequelize-typescript';

@DefaultScope({
	attributes: ['bottoken', 'devtoken', 'defaultprefix', 'apikey', 'googleapikey', 'googlecustomsearchid'],
})
@Table
export class BotConfig extends Model<BotConfig> {

	@AllowNull(false)
	@Column(DataType.STRING(65))
	public readonly bottoken!: string;

	@AllowNull(false)
	@Column(DataType.STRING(65))
	public readonly devtoken!: string;

	@AllowNull(false)
	@Column(DataType.STRING(2))
	public readonly defaultprefix!: string;

	@AllowNull(false)
	@Column(DataType.STRING(40))
	public readonly apikey!: string;

	@Column(DataType.STRING(50))
	public readonly googleapikey: string;

	@Column(DataType.STRING(50))
	public readonly googlecustomsearchid: string;

	constructor(){
		super();
		this.googleapikey = "";
		this.googlecustomsearchid = "";
	}

}