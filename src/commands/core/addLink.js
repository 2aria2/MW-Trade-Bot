const { EmbedBuilder, MessageFlags } = require("discord.js");
const addLink = require("../../../config/config.js").configurations.addlink;

module.exports = {
	name: "addlink",
	aliases: [],
	category: "core",
	utilisation: "addlink",
	description: "Returns with a link for you to add this bot!",
	async execute(interactionCreate) {
		try {
			const embed = new EmbedBuilder();
			embed
				.setTitle("Add This Bot to Your Server!")
				.addFields({ name: "Bot Invite Link", value: `[Click here to add the bot](<${addLink}>)` })
				.setTimestamp();

			await interactionCreate.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
		} catch(error) {
			// Error handling
			await interactionCreate.reply({
				content: "An error occurred while processing the request.",
				flags: MessageFlags.Ephemeral
			});
			console.error(error);
		}
	}
}