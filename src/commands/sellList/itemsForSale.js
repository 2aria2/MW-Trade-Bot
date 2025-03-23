const { Pagination } = require("pagination.djs");
const { getAllItemsForSale } = require("../../models/sellList.js").sellListModel;
const { EmbedBuilder, MessageFlags } = require("discord.js");

module.exports = {
	name: "sale-list",
	aliases: [],
	category: "selling",
	utilisation: "sale-list",
	description: "Shows items on sale.",

	async execute(interactionCreate, interactionAuthorID) {
		try {
			const arrayOfItemsOnSale = await getAllItemsForSale();
			if(!arrayOfItemsOnSale || arrayOfItemsOnSale.length == 0) return await interactionCreate.reply({
				content: "No Items on sale yet.",
				flags: MessageFlags.Ephemeral
			});

			// pagination
			const pagination = new Pagination(interactionCreate, { ephemeral: true });
			const embeds = [];
			const NumberOfPages = Math.ceil(arrayOfItemsOnSale.length / 30);


			for (let i = 0; i < NumberOfPages; ++i) {
				const startIndex = i * 30;
				const endIndex = Math.min(startIndex + 30, arrayOfItemsOnSale.length);
				const pageSellers = arrayOfItemsOnSale.slice(startIndex, endIndex);
				const newEmbed = new EmbedBuilder()
					.setTitle(`Items on sale:`)
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
			logError("error in itemsForSale", error);
			return await interactionCreate.reply({
				content: "An error occurred while processing the request.",
				flags: MessageFlags.Ephemeral
			});
		}
	}
}