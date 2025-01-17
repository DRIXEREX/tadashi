const { EmbedBuilder, AttachmentBuilder, PermissionsBitField, ApplicationCommandOptionType } = require("discord.js");
const levelDB = require('../../models/Level')
const Canvacord = require('canvacord')
const Success = require('../../utils/Success')
const Error = require('../../utils/Error')

module.exports = {
    name: "rank",
    description: "Permet de voir votre niveau dans ce serveur",
    usage: "/rank `(user: utilisateur)`",
    example: "/rank `(user: @drixerex)`",
    category: "⚙️ Utilités",
    permissions: ["UseApplicationCommands"],
    options: [
        {
            name: "user",
            description: "Utilisateur",
            type: ApplicationCommandOptionType.User,
            required: false
        }
    ],
    async runInteraction (client, interaction) {
        const { options, user, guild } = interaction

        const Member = options.getMember("user") || user
        const member = guild.members.cache.get(Member.id)

        const Data = await levelDB.findOne({ Guild: guild.id, User: member.id }).catch(err => { })
        if (!Data) return Error(interaction, `Ce membre à 0 XP !`)

        await interaction.deferReply()

        const Required = Data.Level * Data.Level * 100 + 100

        const rank = new Canvacord.Rank()
            .setAvatar(member.displayAvatarURL({ forceStatic: true }))
            .setBackground("IMAGE", "https://zupimages.net/up/22/35/nlg0.png")
            .setCurrentXP(Required)
            .setRank(1, "Rank", false)
            .setLevel(Data.Level)
            .setProgressBar("#FFFFFF", "COLOR")
            .setUsername(member.user.username)
            .setDiscriminator(member.user.discriminator)

        const Card = await rank.build().catch(err => console.log(err))
        
        const attachment = new AttachmentBuilder(Card, { name: "rank.png" })

        const embed = new EmbedBuilder()
            .setTitle(`Carte de rank de ${member.user.username}`)
            .setImage("attachment://rank.png")
            .setColor(client.color)

        interaction.editReply({ embeds: [embed], files: [attachment] })
    }
};