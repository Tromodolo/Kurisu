 let request = require("request");

module.exports = class TriviaHandler{
    constructor(guildID, channelID){
        this.active = false;
        this.guildID = guildID;
        this.channelID = channelID;
/*         this.token; */
        this.currentQuestion = null;
        this.categoryChoices = [
            12, //Music
            15, //Games
            18, //Science Computers
            23, //History
            31  //Anime
        ]
    }

/*      getToken(){
        return new Promise((resolve) => {
            request({
                url: "https://opentdb.com/api_token.php?command=request",
                json: true
            }, (error, resp, body) => {
                this.token = body.token;
                resolve(body.token);
            })
        })    
    }  */

    setInactive(){
        this.active = false;
    }

    getQuestion(){
        return new Promise(async (resolve) => {
/*             if(!this.token) await this.getToken();*/
            let category = Math.floor(Math.random() * this.categoryChoices.length);

            request({
                url: `https://opentdb.com/api.php?amount=1&category=${this.categoryChoices[category]}&type=multiple`,
                json: true
            }, async (error, resp, body) => {
                if(body.response_code == 4){
                    /* await this.getToken(); */
                    resolve(await this.getQuestion());
                }
                else{
                    this.currentQuestion = body.results[0];
                    this.active = true;
                    resolve(this.currentQuestion);
                }
            })
        })
    }
}