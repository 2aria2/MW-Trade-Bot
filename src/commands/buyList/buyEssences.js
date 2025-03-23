const { searchEssenceByName, fetchEssenceData } = require("../../utils/jsonLookup/fetchByEssences.js");
const { ApplicationCommandOptionType, EmbedBuilder, MessageFlags } = require("discord.js");
const buyListModel = require("../../models/buyList.js").buyListModel;

module.exports = {
	name: "buy-essences",
	aliases: [],
	category: "buying",
	utilisation: "buy-essences <essence> <action> <quantity>",
	description: "Manipulates the essence to the list of items you want to buy.",
	options: [
		{
			name: "essence-name",
			description: "The name of the essence to buy",
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
			if (name === "essence-name") {
				if(value.length < 1) return;
				const essenceName = await searchEssenceByName(value);
				const suggestedEssences = essenceName.slice(0, 25).map(essence => ({
					name: essence["Essence Name"],
					value: essence["Essence Name"]
				}));
				await interactionCreate.respond(suggestedEssences);
			}
		} catch(error) {
			logError("Error in autocomplete for buying essences", error);
		}
	},

	async execute(interactionCreate, interactionAuthorID) {
		try {
			const selectedEssenceName = interactionCreate.options.getString("essence-name");
			const selectedQuantity = parseInt(interactionCreate.options.getInteger("quantity"));
			const selectedAction = interactionCreate.options.getString("action");

			if(selectedQuantity < 1) return await interactionCreate.reply({ flags: MessageFlags.Ephemeral, content: `Quantity must be valid.` });

			// validation - this is the best way to validate this (by checking if the essence has any actual data)
			const selectedEssenceData = await fetchEssenceData(selectedEssenceName);
			if(!selectedEssenceData) {
				logInfo("Could Not find Essence", { selectedEssenceName });
				return await interactionCreate.reply({
					content: "The provided essence could not be found.",
					flags: MessageFlags.Ephemeral
				});
			}

			// The reason why this is done is to take the data from the json file, which we know is more likely to be right than the raw text
			const selectedEssenceNameFromData = selectedEssenceData["Essence Name"];
			const embed = new EmbedBuilder();
			const initialAmount = await buyListModel.getUserItemData(interactionAuthorID, selectedEssenceName) || 0;

			if (selectedAction === "Add") {
				await buyListModel.addItem(interactionAuthorID, selectedEssenceNameFromData, selectedQuantity);
				embed
				.setTitle(`Added ${selectedQuantity}`);
			} else {
				if(initialAmount < selectedQuantity || !initialAmount) return await interactionCreate.reply({ flags: MessageFlags.Ephemeral, content: `${selectedQuantity} exceeds ${initialAmount}` });
				await buyListModel.subtractItem(interactionAuthorID, selectedEssenceNameFromData, selectedQuantity);
				embed
				.setTitle(`Subtracted ${selectedQuantity}`);
			}

			const finalAmount = await buyListModel.getUserItemData(interactionAuthorID, selectedEssenceName);
			embed
			.setDescription(`You currently want to buy ${finalAmount} ${selectedEssenceName}.`)
			.setTimestamp();

			return await interactionCreate.reply({
				embeds: [embed],
				flags: MessageFlags.Ephemeral
			});
		} catch(error) {
			logError("error in buyEssences", error);
			return await interactionCreate.reply({
				content: "An error occurred while processing the request.",
				flags: MessageFlags.Ephemeral
			});
		}
	}
} 