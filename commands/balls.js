const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const page = require("discord-pagination-advanced");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("balls")
		.setDescription("Displays all your Country Balls"),
	async execute(interaction) {
		let user = await db.get(`user-${interaction.user.id}`);
		let list = user.balls;
		let embeds = [],
			i = 0;
		for (let j = 0; j < Math.ceil(list.length / 20); j++) {
			let str = ``;
			for (i; i < 19; i++) {
				const ball = await balls.get(`balls-`+list[i])
				if(!ball) continue;
				let time = Math.floor(ball.caughtOn/1000)
				str+= `\`${ball.id}\`　•　**${ball.shiny?`:sparkles: `:``}${ball.class}**　•　**Lv.**${ball.level}　•　<t:${time}:R>\n`
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
