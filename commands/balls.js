const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const page = require("discord-pagination-advanced");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("balls")
		.setDescription("Displays all your Country Balls"),
	async execute(interaction) {
		let user = await db.get(`user-${interaction.user.id}`);
		if(!user) user = {
            balance: {
              coins: 0,
              shards: 0,
            },
            balls: [],
            countries: [],
            stats: {
              catches: 0,
            },
          };
		let list = user.balls;
		let len = list.length
		let embeds = [],
			ei = len;
		for (let j = 0; j < Math.ceil(list.length / 20); j++) {
			let str = ``;
			for (let i = 0; i < 19; i++) {
				const ball = await balls.get(`balls-`+list[ei-1])
				if(!ball) continue;
				console.log(ball)
				let time = Math.floor(ball.caughtOn/1000)
				let index = ball.index || user.balls.indexOf(ball.id)
				index = `${len-(ei-1)}`.padStart(2, ` `)
				let iv = ball?.stats?.avgIv||`~`
				if(isNaN(iv)) iv = `~`
				str+= `\`${(index)}\`. \`${ball.id}\`　•　**${ball.shiny?`:sparkles: `:``}${ball.class}**　•　Lv.${ball.level}　•　${iv}%　•　<t:${time}:R>\n`
				ei--
			}
			let embed = new EmbedBuilder()
				.setTitle(`Your Balls collection`)
				.setColor("Purple")
				.setDescription(`${str}`)
				.setFooter({text: `Showing page: ${j+1}/${Math.ceil(list.length / 20)}`})
			embeds.push(embed);
		}
		const options =  {
			emojis: [`arrow_backward`, `arrow_forward`, `❌`],
			filter: (i) => i.user.id == interaction.user.id
		 }		 
		page(interaction, embeds, options);
	},
};
