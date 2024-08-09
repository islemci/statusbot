/* Made with ♥ by musti */
/* Consider supporting my work by sponsoring me on Github: */
/* https://github.com/sponsors/islemci */

const { Client, EmbedBuilder } = require('discord.js');
const config = require('./config.json');
const ready = require('./modules/ready');
const axios = require('axios');
const { JsonDatabase } = require("worldbase");
const db = new JsonDatabase({
  databasePath: "./logs/status.json"
})

const bot = new Client({ intents: 0 });
const statuschannel = config.bot.statuschannel;

const startup = new EmbedBuilder()
    .setColor('#23a758')
    .setFooter({ text: 'Some users should expect high loading times.' })
    .setDescription("<:high:1271087398989594635> The server has been stabilized.")

const low = new EmbedBuilder()
    .setColor('#f7a53f')
    .setFooter({ text: 'Our team has been notified, and will improve response times.' })
    .setDescription("<:mid:1271087401766228069> API Overwatch has detected high response times.")

const crash = new EmbedBuilder()
    .setColor('#e93947')
    .setFooter({ text: 'Our team has been notified, and will recover the service soon.' })
    .setDescription("<:low:1271087404886786240> API Overwatch has failed to verify the server status.")

ready(bot, statuschannel);

bot.login(config.bot.token);

async function pingWebsite() {
  const start = Date.now();
  try {
    const response = await axios.get('https://musti.codes');
    const responseTime = Date.now() - start;
    const channel = await bot.channels.fetch(statuschannel);
    let g = db.get("good_warn_message");
    let m = db.get("mid_warn_message");
    let b = db.get("bad_warn_message");
    if (response.status === 200) {
      if (responseTime <= 1000) {
        if (g === 1) {
        } else {
          channel.send({embeds: [startup]});
          db.set("good_warn_message", 1);
          db.set("mid_warn_message", 0);
          db.set("bad_warn_message", 0);
        }
      } else if (m === 1) {
      } else {
        channel.send({embeds: [low]});
        db.set("mid_warn_message", 1);
        db.set("good_warn_message", 0);
        db.set("bad_warn_message", 0);
      }
    } else if (b === 1) {
    } else {
      channel.send({embeds: [crash]});
      db.set("bad_warn_message", 1);
      db.set("good_warn_message", 0);
      db.set("mid_warn_message", 0);
    }
  } catch (error) {
  }
}

setInterval(pingWebsite, 60000);