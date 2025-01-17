const warnModel = require('../../models/warnModel');
const { ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');
const Success = require('../../utils/Success')
const Error = require('../../utils/Error')

module.exports = {
    name: "unwarn",
    description: "Enlève un avertissement d'un utilisateur",
    usage: "/unwarn `[id: Identifiant d'avertissement]`",
    example: "/unwarn `[id: 9s4d8qs4d84qs5054d5qsqsd234d]`",
    category: "🔨 Modération",
    permissions: ["KickMembers"],
    options: [
      {
        name: "id",
        description: "Identifiant d'avertissement",
        type: ApplicationCommandOptionType.String,
        required: true
      }
    ],
    async runInteraction(client, interaction) {
      const warnId = interaction.options.getString("id")

      const data = await warnModel.findById(warnId);

      if(!data) return Error(interaction, `${warnId} n'est pas un identifiant d'avertissement valide !`)
      
      data.delete();

      const user = interaction.guild.members.cache.get(data.userId);
      Success(interaction, `L'avertissement de ${user} a été enlevé avec succès !`)
    }
}