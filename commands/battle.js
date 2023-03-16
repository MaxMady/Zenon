const { SlashCommandBuilder } = require('discord.js');
const { damage } = require('../battle/damage')
const { startBattle } = require(`../battle/startBattle`)
module.exports = {
	data: new SlashCommandBuilder()
		.setName('battle')
		.setDescription('Battle another user with your balls!')
        .addUserOption(option => option.setName('opponent').setDescription('Opponent').setRequired(true))
        .addStringOption(option => option.setName('ball').setDescription('Ball ID').setRequired(true)),
	async execute(interaction) {
        await interaction.deferReply()
        const opponent = interaction.options.getUser('opponent');
        const ballId = interaction.options.getString('ball').trim()

        if(opponent.bot) return await interaction.editReply({content:`You cannot battle a bot!`, ephemeral: true})

        let user = await db.get(`user-${interaction.user.id}`)
        let opponentInfo = await db.get(`user-${opponent.id}`)

        await interaction.channel.send({content: `${interaction.user} is challenging ${opponent} for a 1v1 battl! Do you accept this?`})
        //Check if he accepts
        let id2 ="1382165"
        let ball1 = await balls.get(`balls-${ballId}`)
        let ball2 = await balls.get(`balls-${id2}`)
        if(user.countries.includes(ball1.class)&& opponentInfo.countries.includes(ball2.class)) {
            
            let stat1 = {
                name:ball1.class,
                atk:ball1.stats.atkIv,
                def:ball1.stats.defIv,
                spd:ball1.stats.spdIv,
                level: ball1.level
            }
            let stat2 = {
                name:ball2.class,
                atk:ball2.stats.atkIv,
                def:ball2.stats.defIv,
                spd:ball2.stats.spdIv,
                level: ball2.level
            }
            await startBattle([stat1, stat2], interaction)
        } else {
            console.log(user)
            console.log(opponentInfo)
            await interaction.editReply({content: 'Someone has entered a ball ID that they dont have!', ephemeral: false});    
        }

	},
};