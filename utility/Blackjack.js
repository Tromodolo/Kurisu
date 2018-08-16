const uuidv1 = require('uuid/v1');
const request = require("request");
const config = require('../config.json');
const DiscordEmbed = require("../utility/DiscordEmbed");
const Colour = require("../bot").kurisuColour;
const removeBlackjack = require("../bot").removeBlackjack;

module.exports = class Blackjack{
    constructor(member, bet, channelid, client){        
        this.gameOwner  = member.user,
        this.botClient  = client,
        this.players    = [],
        this.playerTurn = 0,
        this.channelId  = channelid,
        this.message    = null,
        this.messageEmbed = null,
        this.deckId     = null,
        this.started    = false,
        this.dealerHand = {
            hand: [],
            soft: false,
            value: 0
        },
        this._messageHandler = this._messageEvent.bind(this);

        //Add creator of the table to the player list
        this.players.push({
            user: member.user,
            turnOrder: 0,
            bet: bet,
            firstHand: [],
            value: 0,
            soft: false,
            //Only used if split
            secondHand: [],
            secondValue: 0
        });

        this.botClient.createMessage(this.channelId, `${this.gameOwner.username} wants to start a blackjack game. Write ${config.commandPrefix}join X if you want to join, where X is your bet. ${this.gameOwner.username} can start the game at any moment with ${config.commandPrefix}start`);
    }

    async registerEvent(){
        this.botClient.on("messageCreate", this._messageHandler);
    }

    async unregisterEvent(){
        this.botClient.off("messageCreate", this._messageHandler);
    }

    async _messageEvent(message){
        if(message.content.startsWith(`${config.commandPrefix}join`)){
            let args = message.content.split(" ");
            if(args.length < 2){
                this.botClient.createMessage(this.channelId, "You need to choose a bet amount");
                return;
            }
            else{
                let bet = parseInt(args[1]);
                if(bet < 0){
                    this.botClient.createMessage(this.channelId, "You can't bet a negative amount");
                    return;
                }
                else{
                    this.players.push({
                        user: message.author,
                        turnOrder: this.players.length,
                        bet: bet,
                        firstHand: [],
                        value: 0,
                        soft: false,
                        //Only used if split
                        secondHand: [],
                        secondValue: 0
                    });
                }
            }
        }

        if(message.author.id == this.gameOwner.id && message.content ==  `${config.commandPrefix}start`) await this.startGame();

        if(!this.started) return;
    }

    async getDeck(){
        return new Promise(async (resolve, reject) => {
            request({
                url: "https://deckofcardsapi.com/api/deck/new/",
                json: true
            }, (error, resp, body) => {
                if(error) reject(error);
                    this.deckId = body.deck_id;
                    request({
                        url: `https://deckofcardsapi.com/api/deck/${this.deckId}/shuffle`,
                        json: true
                    }, (error, resp, body) => {
                        if(error) reject(error);
                        return resolve(this.deckId);
                    });
                });
            }) 
    }

    async drawCard(dealer, playerId){
        return new Promise(async (resolve, reject) => {
            if(!this.deckId) await this.getDeck();

            request({
                url: `https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=1`,
                json: true
            }, (error, resp, body) => {
                if(error) reject(error);

                let card = body.cards[0];
                let cardValue = 0;
                let soft = false;

                switch(card.value){
                    case "KING":
                    case "QUEEN":
                    case "JACK":
                        cardValue = 10;
                        break;
                    case "ACE":
                        cardValue = 11;
                        soft = true;
                        break;
                    default:
                        cardValue = parseInt(card.value);
                        break;
                }

                if(dealer == true){
                    this.dealerHand.hand.push(card);
                    this.dealerHand.value += cardValue;
                    this.dealerHand.soft = soft;
                }
                else{
                    let index;
                    for(let i in this.players){
                        if(this.players[i].user.id == playerId){
                            index = i; 
                            break;  
                        }
                    }
                    this.players[index].firstHand.push(card);
                    this.players[index].value += cardValue;
                    this.players[index].soft = soft;
                }
                resolve(card);
            })
        });        
    }

    async startGame(){
        return new Promise(async (resolve) => {
            if(this.started){
                this.botClient.createMessage(this.channelId, "The game has already started");
                return resolve();
            }
            this.started = true;

            this.messageEmbed = {
                embed: {
                    color: Colour,
                    author: {
                        name: "Blackjack"
                    },
                    fields: []
                }
            }

            //Let dealer draw a card
            await this.drawCard(true, null);

            let dealerCard = this.dealerHand.hand[0].code;

            dealerCard = dealerCard.replace("H", "`♥️`");
            dealerCard = dealerCard.replace("C", "`♣️`");
            dealerCard = dealerCard.replace("S", "`♤`");
            dealerCard = dealerCard.replace("D", "`♦️`");

            if(dealerCard.startsWith("0")) dealerCard = "1" + dealerCard;

            this.messageEmbed.embed.fields.push(
            {
                name: "Dealer",
                value: `Value: ${this.dealerHand.value}\n**${dealerCard} **`
            })

            await asyncForEach(this.players, async player => {
                return new Promise(async (resolve) => {
                    await this.drawCard(false, player.user.id);
                    await this.drawCard(false, player.user.id);

                    let cards = "";
                    player.firstHand.forEach(card => {
                        let text = card.code;

                        text = text.replace("H", "`♥️`");
                        text = text.replace("C", "`♣️`");
                        text = text.replace("S", "`♤`");
                        text = text.replace("D", "`♦️`");

                        if(text.startsWith("0")) text = "1" + text;

                        cards = cards + text + " ";
                    })
                    let handText = `Value: ${player.value}\n**${cards}**`

                    this.messageEmbed.embed.fields.push(
                    {
                        name: player.user.username,
                        value: handText,
                        inline: true
                    })
                    resolve();
                })
            }).then(() => {
                let message = this.botClient.createMessage(this.channelId, this.messageEmbed);

                this.message = message;
                return resolve();
            });
        });
    };

    async updateHand(dealer, userid){
        return new Promise(async (resolve) => {

        });
    }
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
}

        /* 
        {
            user: user,
            bet: 50,
            firstHand: [],
            value: 18,
            //Only used if split
            secondHand: [],
            secondValue: null
        }
        */

    //https://deckofcardsapi.com/api/deck/new/
    //https://deckofcardsapi.com/api/deck/<<deck_id>>/draw/?count=1


    /*         return new Promise((resolve) => {
            request({
                url: "https://opentdb.com/api_token.php?command=request",
                json: true
            }, (error, resp, body) => {
                this.token = body.token;
                resolve(body.token);
            })
        }) */

    
