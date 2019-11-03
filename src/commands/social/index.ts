import KurisuModule from "../../models/CommandModule";
import { Bot } from "../../bot";

export default class SocialModule extends KurisuModule{
	constructor(bot: Bot){
		super(
			bot,
			"Social",
			[],
			__dirname,
		);
	}
}