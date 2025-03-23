const { Pagination } = require("pagination.djs");
const { ApplicationCommandOptionType, EmbedBuilder, MessageFlags } = require("discord.js");
const buyListModel = require("../../models/buyList.js").buyListModel;

module.exports = {
	name: "search-buy-list",
	aliases: [],
	category: "buying",
	utilisation: "search-buy-list <item>",
	description: "Search for items that players want to buy.",
	options: [
		{
			name: "item",
			description: "The item to search for",
			type: ApplicationCommandOptionType.String,
			required: true
		}
	],

	async execute(interactionCreate) {
		try {
			const searchTerm = interactionCreate.options.getString("item");
			const itemsForPurchase = await buyListModel.getItemsForPurchase(searchTerm);
			
			if(!itemsForPurchase || itemsForPurchase.length == 0) return await interactionCreate.reply({
				content: "No items found matching your search.",
				flags: MessageFlags.Ephemeral
			});

			// pagination
			const pagination = new Pagination(interactionCreate, { ephemeral: true });
			const embeds = [];
			const NumberOfPages = Math.ceil(itemsForPurchase.length / 30);

			for (let i = 0; i < NumberOfPages; ++i) {
				const startIndex = i * 30;
				const endIndex = Math.min(startIndex + 30, itemsForPurchase.length);
				const pageItems = itemsForPurchase.slice(startIndex, endIndex);
				const newEmbed = new EmbedBuilder()
					.setTitle(`Search Results for "${searchTerm}":`)
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
			logError("error in searchBuyListByItem", error);
			return await interactionCreate.reply({
				content: "An error occurred while processing the request.",
				flags: MessageFlags.Ephemeral
			});
		}
	}
} 