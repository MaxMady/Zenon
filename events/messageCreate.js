const { Events,EmbedBuilder } = require("discord.js");
const { spawn } = require("../utils/spawn");
const { prefix, admins, errorPayLoad } = require("../config");
const { caughtBall } = require("../utils/caughtBall.js");

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;
    let id = message.guild.id;
    let c = messageCounter.get(id);
    if (!c) {
      c = { points: 0, time: null };
    }
    const currentTime = Date.now();
    if (c.time && currentTime - c.time < 1000) {
      c.points += 3;
    } else if (c.time && currentTime - c.time < 5000) {
      c.points += 5;
    } else {
      c.points += 7;
    }
    c.time = currentTime;
    if (c.points >= 150) {
      spawn(message);
      c.points = 0;
      c.time = null;
    }
    await messageCounter.set(`${id}`, c);
    console.log(c);
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if (cmd === `catch`) {
      let country = args.join(` `);
      let spawn = await db.get(`spawn-${message.guild.id}`);
      if (!spawn) {
        return message.reply(`There isn't any active spawns in this server!`);
      }
      if (country.toLowerCase() == spawn.class.toLowerCase()) {
        caughtBall(spawn, message, 0);
      } else {
        message.reply(`Wrong country name! Try again...`);
      }
    } else if (cmd === `eval`) {
      if (admins.includes(message.author.id)) {
        const clean = async text => {
          if (typeof text === "string")
            return (
              text
                // .replace(/`/g, "`" + String.fromCharCode(8203))
                .replace(/@/g, "@" + String.fromCharCode(8203))
                .replace(/token/g, "[Something Important]")
            );
          else return text;
        };
        let code = args.join(" ");
        if (!code) {
          return message.channel.send("You forgot your code, dummy");
        }
        // The code might begin in code blocks that is ``` and there might be a extra "js" annotation saying it's a javascript code.
        // Create a regex to replace the ``` if the code starts and ends with it along with the js if it is available at the starting after codeblock
        code = code.replace(/```js/g, "");
        code = code.replace(/```/g, "");
        code = code.replace(/token/g, "[Something Important]");
    
        try {
          let evalCode = code.includes(`await`) ? `;(async () => { ${code} })()` : code;

          let evaled = await clean(eval(evalCode));
          if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
    
          let output;
          if (evaled !== undefined) {
            output = `\`\`\`js\n` + evaled + `\n\`\`\``;
          } else {
            output = `\`\`\`fix\nNo Output To Show.\n\`\`\``;
          }
          output = output.length > 1024 ? "```fix\nLarge Output\n```" : output;
          // So, we'll have to filter the output of client.token variable in the output, search for it, and replace it with [Something important]
          output = output.replace(new RegExp(client.token, "g"), "[Something Important]");
          const embed = new EmbedBuilder()
            .setAuthor({ name: "Eval", iconURL: message.author.avatarURL() })
            .setFields([{name: `Input`, value: `\`\`\`js\n${code}\n\`\`\``}, {name: `Output`, value: output}])
            .setColor("#00ffee")
            .setTimestamp();
          message.channel.send({ embeds: [embed] });
        } catch (err) {
          const errorEmb = new EmbedBuilder()
            .setAuthor({ name: "Eval", iconURL: message.author.avatarURL() })
            .setColor(`#ff0000`)
            .setFields([{name: `Input`, value: `\`\`\`js\n${code}\n\`\`\``}, {name: `Error`, value: `\`\`\`js\n${err}\n\`\`\``}])
          message.channel.send({ embeds: [errorEmb] });
        }
      }
    }
  },
};


const clean = text => {
  if (typeof text === 'string') {
    return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
  } else {
    return text;
  }
};
