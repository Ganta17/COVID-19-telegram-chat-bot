var TelegramBot = require('node-telegram-bot-api');
var apikey = "1383663823:AAHl_7bR-X9aaai5NGsYe__sulEw7N8JnYk";

var bot = new TelegramBot(apikey, {polling: true});
var request = require("request");
var mongojs = require('mongojs');

var cString = "mongodb+srv://ramyaganta:ramyaganta@cluster0.zkqnq.mongodb.net/capstone?retryWrites=true&w=majority";
var db = mongojs(cString,['covid'])

bot.on('message',function(msg){
var t=msg.text;
var temp='hai';
if(msg.text.toString().includes(temp)){
	bot.sendMessage(msg.chat.id,"hai, How can I help you."+"\n"+"If you need the information of covid-19-statistics upto the given date...please enter the date?");
}
else{
var options = {
  method: 'GET',
  url: 'https://covid-19-statistics.p.rapidapi.com/reports/total',
  qs: {date: t},
  headers: {
    'x-rapidapi-host': 'covid-19-statistics.p.rapidapi.com',
    'x-rapidapi-key': '85401459bamshc2bf42b84e071edp1df737jsn66983620f368',
    useQueryString: true
  }
};

request(options, function (error, response, body) {
	if (error) throw new Error(error);

	else {
	user = {
	date : JSON.parse(body).data.date,
	deaths : JSON.parse(body).data.deaths,
	confirmed:JSON.parse(body).data.confirmed,
	Recovered: JSON.parse(body).data.recovered,
	Active : JSON.parse(body).data.active
	}
	if(t == JSON.parse(body).data.date) {
	db.covid.insert(user,function(err,docs){
	if(err){
		console.log(err);
	}
	else{
		bot.sendMessage(msg.chat.id,"Date : " + JSON.parse(body).data.date +"\n"+ "Deaths : " + JSON.parse(body).data.deaths + " \n " + "Confirmed : " + JSON.parse(body).data.confirmed + "\n" + "Recovered : " + JSON.parse(body).data.recovered + "\n Active : " + JSON.parse(body).data.active);
	}
	});
   }
   }
});
}
});
