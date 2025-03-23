const { searchBlockByName, fetchBlockData } = require("../../utils/jsonLookup/fetchByBlocks.js").InfBlocks;
const { ApplicationCommandOptionType, EmbedBuilder, MessageFlags } = require("discord.js");
const buyListModel = require("../../models/buyList.js").buyListModel;

module.exports = {
	name: "buy-block",
	aliases: [],
	category: "buying",
	utilisation: "buy-block <block> <action> <quantity>",
	description: "Manipulates the block to the list of items you want to buy.",
	options: [
		{
			name: "block-name",
			description: "The name of the block to buy",
			type: ApplicationCommandOptionType.String,
			required: true,
			autocomplete: true
		},
		{
			name: "quantity",
			description: "The amount to manipulate",
			type: ApplicationCommandOptionType.Integer,
			required: true
		},
		{
			name: "action",
			description: "Action to carry out",
			type: ApplicationCommandOptionType.String,
			required: true,
			choices: [
				{ name: "Add", value: "Add" },
				{ name: "Subtract", value: "Subtract" }
			]
		}
	],

	async autocomplete(interactionCreate) {
		try {
			const { value, name } = interactionCreate.options.getFocused(true);
			if (name === "block-name") {
				if(value.length < 1) return;
				const blockName = await searchBlockByName(value);
				const suggestedBlocks = blockName.slice(0, 25).map(block => ({
					name: block["Block Name"],
					value: block["Block Name"]
				}));
				await interactionCreate.respond(suggestedBlocks);
			}
		} catch(error) {
			logError("Error in autocomplete for buying blocks", error);
		}
	},

	async execute(interactionCreate, interactionAuthorID) {
		try {
			const selectedBlockName = interactionCreate.options.getString("block-name");
			const selectedQuantity = parseInt(interactionCreate.options.getInteger("quantity"));
			const selectedAction = interactionCreate.options.getString("action");

			if(selectedQuantity < 1) return await interactionCreate.reply({ flags: MessageFlags.Ephemeral, content: `Quantity must be valid.` });

			// validation - this is the best way to validate this (by checking if the block has any actual data)
			const selectedBlockData = await fetchBlockData(selectedBlockName);
			if(!selectedBlockData) {
				logInfo("Could Not find Block", { selectedBlockName });
				return await interactionCreate.reply({
					content: "The provided block could not be found.",
					flags: MessageFlags.Ephemeral
				});
			}

			// The reason why this is done is to take the data from the json file, which we know is more likely to be right than the raw text
			const selectedBlockNameFromData = selectedBlockData["Block Name"];
			const embed = new EmbedBuilder();
			const initialAmount = await buyListModel.getUserItemData(interactionAuthorID, selectedBlockName) || 0;

			if (selectedAction === "Add") {
				await buyListModel.addItem(interactionAuthorID, selectedBlockNameFromData, selectedQuantity);
				embed
				.setTitle(`Added ${selectedQuantity}`);
			} else {
				if(initialAmount < selectedQuantity || !initialAmount) return await interactionCreate.reply({ flags: MessageFlags.Ephemeral, content: `${selectedQuantity} exceeds ${initialAmount}` });
				await buyListModel.subtractItem(interactionAuthorID, selectedBlockNameFromData, selectedQuantity);
				embed
				.setTitle(`Subtracted ${selectedQuantity}`);
			}

			const finalAmount = await buyListModel.getUserItemData(interactionAuthorID, selectedBlockName);
			embed
			.setDescription(`You currently want to buy ${finalAmount} ${selectedBlockName}.`)
			.setTimestamp();

			return await interactionCreate.reply({
				embeds: [embed],
				flags: MessageFlags.Ephemeral
			});
		} catch(error) {
			logError("error in buyBlock", error);
			return await interactionCreate.reply({
				content: "An error occurred while processing the request.",
				flags: MessageFlags.Ephemeral
			});
		}
	}
} 