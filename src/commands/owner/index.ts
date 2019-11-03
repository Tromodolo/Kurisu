import KurisuModule from "../../models/CommandModule";
import { Bot } from "../../bot";

export default class OwnerModule extends KurisuModule{
	constructor(bot: Bot){
		super(
			bot,
			"Owner",
			[],
			__dirname,
		);
	}
}