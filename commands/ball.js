const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");
const page = require("discord-pagination-advanced");
const { calculateStats, getStatValue } = require("../utils/calculateStats");
const cntry = require("../data/final.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ball")
    .setDescription("Displays information about your countryball")
    .addStringOption((option) =>
      option
        .setName("ball")
        .setDescription("Enter the countryball ID")
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();
    let user = await db.get(`user-${interaction.user.id}`);
    let ball = interaction.options.getString("ball");
    let ballD;
    if (ball == `0`) {

        let l = user.balls.length;
        if (l == 0) return await interaction.editReply({ content: `You dont have any balls!`, ephemeral: true });
        let s = user.balls[l-1]
        ballD = await balls.get(`balls-${s}`);
    } else {
      if (!user.balls.includes(ball))
        return await interaction.editReply({
          content: `You dont have a ball with ID \`${ball}\`!`,
          ephemeral: true,
        });
      ballD = await balls.get(`balls-${ball}`);
    }
    if (!ballD)
    return await interaction.editReply({
      content: `Ball with ID \`${ball}\` is not available!`,
      ephemeral: true,
    });
    let index = user.balls.indexOf(ball) + 1;
    let a = ballD.class.replace(" ", `_`);
    let image = new AttachmentBuilder(`./data/images/${a}.png`, {
      name: `info.png`,
    });
    let statEmbed = new EmbedBuilder()
      .setTitle(`Level ${ballD.level} ${ballD.class}`)
      .setFooter({ text: `Showing ball ${index}/${user.balls.length}` })
      .setThumbnail(
        `${interaction.user.displayAvatarURL({ extension: "jpg" })}`
      )
      .setImage(`attachment://info.png`)
      .setColor("Purple");
    let base = ballD?.stats;
    let stat;

    //Base stats
    stat = cntry.find((obj) => obj.Country === ballD.class);

    if (!base) {
      base = calculateStats(stat);
      ballD.stats = base;
      await balls.set(`balls-${ballD.id}`, ballD);
    }
    let totXp = ballD.level * 25 + Math.floor(5 * Math.sqrt(ballD.level));
    let description = `**Details**
**ID:** ${ballD.id}
**XP:** ${ballD?.xp || 0}/${totXp}

**Stats**
**HP:** ${stat.hp}
**Attack:** ${Math.floor(
      getStatValue(stat.atk, base.atkIv, ballD.level)
    )} - ${Math.floor(base.atkIv)}/25
**Defense:** ${Math.floor(
      getStatValue(stat.def, base.defIv, ballD.level)
    )} - ${Math.floor(base.defIv)}/25
**Speed:** ${Math.floor(
      getStatValue(stat.spd, base.spdIv, ballD.level)
    )} - ${Math.floor(base.spdIv)}/25

**Total Power:** ${base.avgIv}%
`;
    statEmbed.setDescription(description);

    await interaction.editReply({ embeds: [statEmbed], files: [image] });
  },
};
