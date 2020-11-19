const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = "jw!";

require('dotenv').config();

var discordToken = process.env.DISCORD_TOKEN;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
  
client.on('message', msg => {

    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const args = msg.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    console.log(msg.guild);
    if (command === "ping") {
        msg.channel.send('Pong.');
    } else if (command === "beep") {
        msg.channel.send('Boop.');
    } else if (command === "members") {
        msg.channel.send("Hay " + msg.guild.memberCount + " personas en el servidor");
    }else if (command === 'ban') {
        if(!msg.mentions.users.size) {
            msg.reply('Tienes que mencionar a alguien!');
            return;
        }

        const taggedUser = msg.mentions.users.first();

        msg.channel.send(`Usuario: ${taggedUser.username}#${taggedUser.discriminator} baneado`);
    } else if (command === 'texto-diario' ) {
        msg.reply(`El texto de hoy es:
        Practiquen el dar, y se les dará (Luc. 6:38).

        Jesús quiere que seamos felices siendo generosos. Muchas personas reaccionan bien a la generosidad. 
        Claro, no todos responden favorablemente, pero la gratitud de quienes sí lo hacen puede motivarlos a ser 
        generosos ellos mismos e iniciar una reacción en cadena. Por lo tanto, debemos seguir siendo generosos 
        incluso cuando parezca que la gente no lo valora. No sabemos cuánto logrará un simple acto de generosidad.
        Quien es generoso de verdad no espera recibir nada a cambio. Jesús tenía esto presente al decir: 
        “Cuando des un banquete, invita a los pobres, a los lisiados, a los cojos, a los ciegos; y serás feliz, 
        porque ellos no tienen con qué pagártelo” (Luc. 14:13, 14). La Biblia dice que el generoso será bendecido 
        y que “cualquiera que obra con consideración para con el de condición humilde” es feliz (Prov. 22:9; Sal. 41:1). 
        En efecto, somos generosos porque ayudar a los demás es un placer.
        `);
    }
});

client.login(discordToken);