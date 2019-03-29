import Axios, { AxiosResponse } from "axios";
import { Client, Member, Message } from "eris";
import fs from "fs";
import htmlToText from "html-to-text";

import { addTrivia, removeTrivia } from "../bot";
import config from "../config";
import { DiscordEmbed } from "../utility/DiscordEmbed";

class TriviaHandler{
	/** Unique id token specific to this game of trivia */
	public token: string = "";
	/** Channel ID the trivia game runs in */
	private channelID: string = "";
	/** eris.js Client used to execute all bot messages */
	private botClient: Client | null = null;
	/** Trivia Question received from Api */
	private currentQuestion: any = {};
	/** List of categories to pick randomly from for the api */
	private categoryChoices: number[] = [
		12, // Music
		15, // Games
		18, // Science Computers
		23, // History
		31,  // Anime
	];
	/** All the answers from all the users */
	private answers: Array<{ text: string, realAnswer: boolean }> = [];
	/** Timer that starts when the first person has answered, regardless if they're correct or not */
	private firstAnswerTimer: any = null;
	/** First user that got the question correct */
	private firstCorrect: Member | undefined;
	/** All the different users and their answers */
	private usersAnswered: Array<{ id: string, answer: number}> = [];

	/**
	 * Removes a TriviaHandler from array
	 * @param {string} channelID ID of channel that trivia game runs in
	 * @param {Client} botClient Bot client to handle sending of messages
 	*/
	constructor(channelID: string, botClient: Client){
		this.channelID = channelID;
		this.botClient = botClient;

		this.messageEvent = this.messageEvent.bind(this);
	}

	/**
	 * Starts a trivia game using the specified channel and information
	 */
	public startTrivia(){
		this.getToken().then(() => {
			this.getQuestion().then(() => {
				this.registerEvent();
				const embed = new DiscordEmbed();
				const handler = this;

				const questionText = htmlToText.fromString(this.currentQuestion.question, {});
				questionText.replace("\n", "");

				embed.setColor(parseInt(config.bot.color));

				// Confused Chen image
				embed.setThumbnail("attachment://chen.png");
				embed.addField("Difficulty", this.currentQuestion.difficulty.charAt(0).toUpperCase() + this.currentQuestion.difficulty.substr(1), true);
				embed.addField("Category", this.currentQuestion.category, true);
				embed.addField("Question", questionText, false);
				embed.addField("Answers", `Write the number you think is correct, you have 15 seconds starting when the first person answers:
                               **1.** ${htmlToText.fromString(this.answers[0].text, {})}
                               **2.** ${htmlToText.fromString(this.answers[1].text, {})}
                               **3.** ${htmlToText.fromString(this.answers[2].text, {})}
                               **4.** ${htmlToText.fromString(this.answers[3].text, {})}`, false);

				fs.readFile(`./data/ChenConfused.png`, async (err: Error, data: Buffer ) => {
					if (!handler.botClient){
						return;
					}
					await handler.botClient.createMessage(handler.channelID, embed.getEmbed(), { file: data, name: "chen.png" });
					addTrivia(this);
				});
			});
		});
	}

	/**
	 * Gets a token specific to this trivia game from the api
	 */
	private getToken(){
		return new Promise((resolve, reject) => {
			Axios.get("https://opentdb.com/api_token.php?command=request")
				 .then((response: AxiosResponse) => {
					 this.token = response.data.token;
					 resolve(this.token);
				 })
				 .catch((error) => {
					 reject(error);
				 });
		});
	}

	/**
	 * Fetches a trivia question from the api
	 */
	private getQuestion(){
		return new Promise(async (resolve) => {
			if (!this.token){
				await this.getToken();
			}

			const category = Math.floor(Math.random() * this.categoryChoices.length);

			Axios.get(`https://opentdb.com/api.php?amount=1&category=${this.categoryChoices[category]}&type=multiple&token=${this.token}`)
				 .then(async (response: AxiosResponse) => {
					if (response.data.response_code === 4){
						await this.getToken();
						resolve(await this.getQuestion());
					}
					else{
						this.currentQuestion = response.data.results[0];

						this.answers.push({ text: this.currentQuestion.correct_answer, realAnswer: true });

						for (const question of this.currentQuestion.incorrect_answers){
							this.answers.push({ text: question, realAnswer: false });
						}

						this.answers = shuffle(this.answers);

						resolve(this.currentQuestion);
					}
				 });
		});
	}

	/**
	 * Adds messageEvent as an event function to be run on every messageCreate event
	 */
	private registerEvent(){
		if (this.botClient){
			this.botClient.on("messageCreate", this.messageEvent);
		}
	}

	/**
	 * Removes messageEvent from being run on every messageCreate event
	 */
	private unregisterEvent(){
		if (this.botClient){
			this.botClient.off("messageCreate", this.messageEvent);
		}
	}

	/**
	 * Event function that will trigger whenever a message is sent out and registerEvent() has been called.
	 * @param message A message object filled with information about a received message.
	 */
	private async messageEvent(message: Message){
		console.log(message.content);
		if (!message.member){
			return;
		}
		if (message.channel.id === this.channelID){
			switch (message.content){
				case "1":
				case "2":
				case "3":
				case "4":
					// Find the index for the answer
					let answerIndex = 0;
					for (const i of this.answers){
						if (this.answers[answerIndex].realAnswer === true){
							break;
						}
						else{
							answerIndex++;
						}
					}
					// if the answertimer doesnt exist, it means its the first person to answer
					if (!this.firstAnswerTimer){
						this.firstAnswerTimer = setTimeout(() => {
							this.unregisterEvent();

							if (!this.botClient){
								return;
							}

							this.botClient.createMessage(this.channelID, "Time's up");

							const correctUsers = this.usersAnswered.filter((x) => x.answer === answerIndex);

							if (correctUsers.length === 0 || !this.firstCorrect){
								this.botClient.createMessage(this.channelID, "No one got the answer right");
							}
							else if (correctUsers.length === 1){
								this.botClient.createMessage(this.channelID, `Only one person got it right, and it was ${this.firstCorrect.mention}.`);
							}
							else if (correctUsers.length > 1){
								this.botClient.createMessage(this.channelID, `Several people got it right, but ${this.firstCorrect.mention} was fastest`);

							}

							removeTrivia(this);
							return;
						}, 10 * 1000); // 10 seconds
					}

					// Checks if someone has claimed first place yet, and if they havent and someone answers right, put them as the winner
					if (!this.firstCorrect && (parseInt(message.content) - 1) === answerIndex){
						this.firstCorrect = message.member;
					}

					this.usersAnswered.push({
						id: message.member.id,
						answer: parseInt(message.content) - 1,
					});

				default:
					break;
			}
		}
	}
}

// https://www.w3resource.com/javascript-exercises/javascript-array-exercise-17.php
/**
 * Returns a shuffled version of the array sent through
 * @param {Array} array Array to shuffle
 */
function shuffle(array: any) {
	let ctr = array.length;
	let temp;
	let index;

	// While there are elements in the array
	while (ctr > 0) {
	// Pick a random index
		index = Math.floor(Math.random() * ctr);
		// Decrease ctr by 1
		ctr--;
		// And swap the last element with it
		temp = array[ctr];
		array[ctr] = array[index];
		array[index] = temp;
	}
	return array;
}

export default TriviaHandler;