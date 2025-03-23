const { Pagination } = require("pagination.djs");
const { ApplicationCommandOptionType, EmbedBuilder, MessageFlags } = require("discord.js");
const buyListModel = require("../../models/buyList.js").buyListModel;

module.exports = {
	name: "buyer-info",
	aliases: [],
	category: "buying",
	utilisation: "buyer-info <user>",
	description: "Shows information about what a user wants to buy.",
	options: [
		{
			name: "user",
			description: "The user to get information about",
			type: ApplicationCommandOptionType.User,
			required: true
		}
	],

	async execute(interactionCreate) {
		try {
			const selectedUser = interactionCreate.options.getUser("user");
			const userItems = await buyListModel.getAllUserItems(selectedUser.id);
			
			if(!userItems || userItems.length == 0) return await interactionCreate.reply({
				content: "This user is not looking to buy anything.",
				flags: MessageFlags.Ephemeral
			});

			// pagination
			const pagination = new Pagination(interactionCreate, { ephemeral: true });
			const embeds = [];
			const NumberOfPages = Math.ceil(userItems.length / 30);

			for (let i = 0; i < NumberOfPages; ++i) {
				const startIndex = i * 30;
				const endIndex = Math.min(startIndex + 30, userItems.length);
				const pageItems = userItems.slice(startIndex, endIndex);
				const newEmbed = new EmbedBuilder()
					.setTitle(`${selectedUser.username}'s Buy List:`)
					.setDescription(pageItems.join("\n"));
			
				embeds.push(newEmbed);
			}

			// pagination details
			pagination.setFooter({ text: "Pagination" });
			pagination.setTimestamp();
			pagination.setEmbeds(embeds);

			// Set footer with page numbers
			pagination.setEmbeds(embeds, (embed, index, array) => {
				return embed.setFooter({ text: `Page: ${index + 1}/${array.length}` });
			});

			pagination.render();
		} catch(error) {
			logError("error in buyerInfo", error);
			return await interactionCreate.reply({
				content: "An error occurred while processing the request.",
				flags: MessageFlags.Ephemeral
			});
		}
	}
} 