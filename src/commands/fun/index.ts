import KurisuModule from "../../models/CommandModule";

import EightBall from "./8ball";
import Deathnote from "./deathnote";
import Emote from "./emote";
import Love from "./love";
import Ouija from "./ouija";
import Quote from "./quote";
import Roll from "./roll";
import Sans from "./sans";
import PleaseHelpMe from "./uwu";
import WordCloud from "./wordcloud";

export default new KurisuModule (
	"✨ Fun",
	[],
	[
		EightBall,
		Deathnote,
		Emote,
		Love,
		Ouija,
		Quote,
		Roll,
		Sans,
		PleaseHelpMe,
		WordCloud,
	],
);