import config from "../src/config";
import { Bot } from '../src/bot';

import { expect } from "chai";
import "mocha";

describe('Bot', () => {
	it('should be created successfully', () => {
		const bot = new Bot(config, false);
		return true;
	});
});