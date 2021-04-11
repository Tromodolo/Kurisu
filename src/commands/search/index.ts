import KurisuModule from "../../models/CommandModule";

import Anime from "./anime";
import Manga from "./manga";
import Weather from "./weather";
import Wolfram from "./wolfram";

export default new KurisuModule (
	"🔍 Search",
	[],
	[
		Anime,
		Manga,
		Weather,
		Wolfram,
	],
);
