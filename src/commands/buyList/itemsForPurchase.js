const { Pagination } = require("pagination.djs");
const { ApplicationCommandOptionType, EmbedBuilder, MessageFlags } = require("discord.js");
const buyListModel = require("../../models/buyList.js").buyListModel;

module.exports = {
	name: "items-for-purchase",
	aliases: [],
	category: "buying",
	utilisation: "items-for-purchase",
	description: "Shows all items that players want to buy.",
	options: [],

	async execute(interactionCreate) {
		try {
			const itemsForPurchase = await buyListModel.getAllItemForPurchase();
			if(!itemsForPurchase || itemsForPurchase.length == 0) return await interactionCreate.reply({
				content: "No items are currently being sought after.",
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
					.setTitle(`Items Players Want to Buy:`)
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
			logError("error in itemsForPurchase", error);
			return await interactionCreate.reply({
				content: "An error occurred while processing the request.",
				flags: MessageFlags.Ephemeral
			});
		}
	}
} 