//Discord vars
const Discord = require('discord.js');
const discordClient = new Discord.Client();
require('dotenv').config();
const discordToken = process.env.DISCORD_TOKEN;
const prefix = process.env.PREFIX;

//Mongo vars
const dsn = process.env.MONGO_DSN;
const mongoose = require('mongoose');
mongoose.connect(dsn, {useNewUrlParser: true, useUnifiedTopology: true});

//Commands Mongoose
const commandSchema = new mongoose.Schema({ name: 'string', group: 'string', description: "string", usage: "string" });
const Command = mongoose.model('command', commandSchema);

//Texts Mongoose
const textSchema = new mongoose.Schema({ date: 'string', text: 'string', textContent: "string", explanation: "string", reference: "string" });
const Text = mongoose.model('text', textSchema);

function getDateString () {
    let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Date object initialized from user's timezone. Returns a datetime string
    let dateStringFromTimeZone = new Date().toLocaleString("en-US", { timeZone: timeZone });

    // Date object initialized from the above datetime string
    let date = new Date(dateStringFromTimeZone);
    
    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear();
    let dateString = `${year}-${month}-${day}`;

    return dateString;
}

discordClient.on('ready', () => {
    console.log(`Logged in as ${discordClient.user.tag}!`);
});
  
discordClient.on('message', async msg => {

    if (!msg.content.startsWith(prefix) || msg.author.bot || !msg.guild) return;

    //Variables
    let sender = msg.author;
    let args = msg.content.slice(prefix.length).trim().split(' ');
    let command = args.shift().toLowerCase();

    if (command === "help") {
        try {
            if (!args.length) {
                await Command.find({}, async function(err, commands) {
                    let commandMap = [];
                    let help = new Discord.MessageEmbed().setColor("0x1D82B6");
                    help.setTitle("Available Command List");

                    commands.forEach(function(command) {
                        if (command.group === "User") {
                            help.addField(`${command.name}`, `**Description:** ${command.description}\n**Usage:** ${command.usage}`);
                        }
                        commandMap.push(command);
                    });

                    console.log(commandMap);
                    msg.channel.send(help);
                });
            }
        } catch (err) {
            msg.channel.send("Ocurrió un error al obtener la ayuda");
        }
    }

    if (command === "ping") {
        msg.channel.send('Pong.');
    } else if (command === "avatar") {
        if (args.length) {
            const user = msg.mentions.users.first();
            msg.channel.send(user.displayAvatarURL());
            return;
        }

        msg.channel.send(msg.author.displayAvatarURL());
    } else if (command === "date") {
        let dateEmbed = new Discord.MessageEmbed().setColor("0x1D82B6");

        //Timezone
        let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        if (args.length) {
            timeZone = args[0]
        }

        // Date object initialized from user's timezone. Returns a datetime string
        let dateStringFromTimeZone = new Date().toLocaleString("en-US", { timeZone: timeZone });

        // Date object initialized from the above datetime string
        let date = new Date(dateStringFromTimeZone);
        
        let day = ("0" + date.getDate()).slice(-2);
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        let year = date.getFullYear();
        let hours = ("0" + date.getHours()).slice(-2);
        let minutes = ("0" + date.getMinutes()).slice(-2);
        let seconds = ("0" + date.getSeconds()).slice(-2);
        let time_hh_mm_ss = hours + ":" + minutes + ":" + seconds;

        dateEmbed.setTitle("Today is:");
        dateEmbed.addField("Day:", day);
        dateEmbed.addField("Month:", month);
        dateEmbed.addField("Year:", year);
        dateEmbed.addField("Time:", time_hh_mm_ss);
        dateEmbed.addField("Time Zone:", timeZone);
        
        msg.channel.send(dateEmbed);
    }  else if (command === 'daily-text' ) {
        try {

            let dailyText = new Discord.MessageEmbed().setColor("0x1D82B6");
            let dateString = getDateString();
            console.log(dateString);

            if (args.length) {
                dateString = args[0];
            }
            
            let text = await Text.findOne({ date : dateString}).exec();

            if (!text) {
                msg.channel.send("No tengo el texto de ese día aún :c");
                return;
            }

            dailyText.setTitle('Texto Diario');
            dailyText.addField(`${text.textContent} (${text.text}).`, `${text.explanation}`);
            dailyText.setFooter(`Tomado de ${text.reference}`);

            await msg.channel.send(dailyText);
            //msg.channel.sendEmbed(dailyText).catch(err => console.log(err));
        } catch (err) {
            console.log(err);
            msg.channel.send("Ocurrió un error al obtener el texto de este día, considera leerlo desde https://jw.org");
        }
    }
});

discordClient.login(discordToken);