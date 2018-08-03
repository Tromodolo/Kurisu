var exports = module.exports = {};

const client = require("../../bot.js").client;
const TriviaHandler = require("../../utility/TriviaHandler");
const DiscordEmbed = require("../../utility/DiscordEmbed");
const Colour = require("../../bot").kurisuColour;
const addTrivia = require("../../bot").addTrivia;
const htmlToText = require('html-to-text');

exports.function = async (msg, args) => {
    let trivia = new TriviaHandler(msg.channel.guild.id, msg.channel.id);
    let embed = new DiscordEmbed();
    let question = await trivia.getQuestion();

    let answers = [];

    answers.push({
        text: question.correct_answer,
        realAnswer: true
    });

    question.incorrect_answers.forEach(answer => {
        answers.push({
            text: answer,
            realAnswer: false
        });
    });

    answers = shuffle(answers);

    let questionText = htmlToText.fromString(question.question, {});
    questionText.replace("\n", "");

    embed.setColor(Colour);
    embed.setThumbnail("https://tro.moe/u/_6udfof502.png");
    embed.addField("Difficulty", question.difficulty.charAt(0).toUpperCase() + question.difficulty.substr(1), true);
    embed.addField("Category", question.category, true);
    embed.addField("Question", questionText, false);
    embed.addField("Answers", `Write the number you think is correct, you have 15 seconds starting when the first person answers:
                               **1.** ${htmlToText.fromString(answers[0].text, {})}
                               **2.** ${htmlToText.fromString(answers[1].text, {})}
                               **3.** ${htmlToText.fromString(answers[2].text, {})}
                               **4.** ${htmlToText.fromString(answers[3].text, {})}`, false);

    client.createMessage(msg.channel.id, embed.getEmbed());
    addTrivia(trivia, answers);
};

exports.description = "Rolls a number from 0 to 100 or a custom max if you specify";
exports.fullDescription = "Rolls a number from 0 to 100 or a custom max if you specify";
exports.usage = "<max>";

//https://www.w3resource.com/javascript-exercises/javascript-array-exercise-17.php
function shuffle(arra1) {
    var ctr = arra1.length, temp, index;

// While there are elements in the array
    while (ctr > 0) {
// Pick a random index
        index = Math.floor(Math.random() * ctr);
// Decrease ctr by 1
        ctr--;
// And swap the last element with it
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    }
    return arra1;
}