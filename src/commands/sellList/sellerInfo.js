const { Pagination } = require("pagination.djs");
const { getAllUserItems } = require("../../models/sellList.js").sellListModel;
const { ApplicationCommandOptionType, EmbedBuilder, MessageFlags } = require("discord.js");

module.exports = {
	name: "seller-info",
	aliases: [],
	category: "selling",
	utilisation: "seller-info <user>",
	description: "Finds items of sellers.",
	options: [
		{
			name: "user",
			description: "user to search by",
			type: ApplicationCommandOptionType.User,
			required: true,
			autocomplete: true
		}
	],

	async execute(interactionCreate, interactionAuthorID) {
		try {
			const selectedUserName = interactionCreate.options.getUser("user");
			const arrayOfItems = await getAllUserItems(selectedUserName.id);
			// pagination
			const pagination = new Pagination(interactionCreate, { ephemeral: true });
			const embeds = [];
			const NumberOfPages = Math.ceil(arrayOfItems.length / 30);


			for (let i = 0; i < NumberOfPages; ++i) {
				const startIndex = i * 30;
				const endIndex = Math.min(startIndex + 30, arrayOfItems.length);
				const pageSellers = arrayOfItems.slice(startIndex, endIndex);
				const newEmbed = new EmbedBuilder()
					.setTitle(`${selectedUserName.username}'s items for sale:`)
					.setDescription(pageSellers.join("\n"));
			
				embeds.push(newEmbed);
			}

			// pagination details
			pagination.setFooter({ text: "Pagination" }); // Fixed: proper object format
			pagination.setTimestamp();
			pagination.setEmbeds(embeds);

			// Set footer with page numbers
			pagination.setEmbeds(embeds, (embed, index, array) => {
				return embed.setFooter({ text: `Page: ${index + 1}/${array.length}` });
			});

			pagination.render();
		} catch (error) {
			logError("error in sellerInfo", error);
			return await interactionCreate.reply({
				content: "An error occurred while processing the request.",
				flags: MessageFlags.Ephemeral
			});
		}
	}
}