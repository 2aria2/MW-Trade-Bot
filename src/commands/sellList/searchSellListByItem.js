const { Pagination } = require("pagination.djs");
const { findUsersByItem, getItemsForSale } = require("../../models/sellList.js").sellListModel;
const { ApplicationCommandOptionType, EmbedBuilder, MessageFlags } = require("discord.js");

module.exports = {
	name: "find-sellers",
	aliases: [],
	category: "selling",
	utilisation: "find-sellers <item>",
	description: "Finds sellers of an item.",
	options: [
		{
			name: "item",
			description: "item to search by",
			type: ApplicationCommandOptionType.String,
			required: true,
			autocomplete: true
		}
	],

	async autocomplete(interactionCreate) {
		try {
			const { value, name } = interactionCreate.options.getFocused(true);
			if (name === "item") {
				if (value.length < 1) return;
				const itemName = await getItemsForSale(value);
				if (!itemName || itemName.length < 1) return;
				const suggestedItems = itemName.slice(0, 25).map(item => ({
					name: item,
					value: item
				}));
				await interactionCreate.respond(suggestedItems);
			}
		} catch (error) {
			logError("Error in autocomplete for find seller items", error);
		}
	},

	async execute(interactionCreate, interactionAuthorID) {
		try {
			const selectedItemName = interactionCreate.options.getString("item");
			const arrayOfSellers = await findUsersByItem(selectedItemName);
			if (!arrayOfSellers || arrayOfSellers.length == 0) {
				return await interactionCreate.reply({ flags: MessageFlags.Ephemeral, content: `No sellers of this item` });
			}

			// pagination
			const pagination = new Pagination(interactionCreate, { ephemeral: true });
			const embeds = [];
			const NumberOfPages = Math.ceil(arrayOfSellers.length / 30);


			for (let i = 0; i < NumberOfPages; ++i) {
				const newEmbed = new EmbedBuilder().setTitle(`Sellers of: ${selectedItemName}`);
				const startIndex = i * 30;
				const endIndex = Math.min(startIndex + 30, arrayOfSellers.length);
				const pageSellers = arrayOfSellers.slice(startIndex, endIndex);
				newEmbed.setDescription("<@" + pageSellers.join(">\n<@") + ">");

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
			logError("error in usersByItemList", error);
			return await interactionCreate.reply({
				content: "An error occurred while processing the request.",
				flags: MessageFlags.Ephemeral
			});
		}
	}
}