const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Shows your balance'),
	async execute(interaction) {
		let user = await db.get(`user.${interaction.user.id}`)
        if(!user) user = { balance:0, shards:0 }
        if(!user.shards) user = { balance:0, shards:0 }

        const embed = new EmbedBuilder()
        .setTitle(`${interaction.user.username}'s balance`)
        .setFields([{name: `Cash $`, value: `${user.balance}`, inline: true}, {name: `Shards`, value: `${user.shards}`, inline:true}])
        .setThumbnail(`${interaction.user.displayAvatarURL({ extension: 'jpg' })}`)
        .setColor(`Green`)
        await interaction.reply({embeds:[embed]})
	},
};