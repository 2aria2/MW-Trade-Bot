const { searchEssenceByName, fetchHighestValidTierByEssenceName, fetchEssencesJsonDataByName } = require("../../utils/jsonLookup/fetchByEssences");
const { ApplicationCommandOptionType, EmbedBuilder, MessageFlags } = require("discord.js");
const sellListModel = require("../../models/sellList.js").sellListModel;

module.exports = {
	name: "sell-essence",
	aliases: [],
	category: "selling",
	utilisation: "sell-essence <essence> <tier> <action> <quantity>",
	description: "Manipulates the new essence to the list of sold items.",
	options: [
		{
			name: "essence-name",
			description: "The name of the essence to sell",
			type: ApplicationCommandOptionType.String,
			required: true,
			autocomplete: true // Enable autocomplete
		},
		{
			name: "essence-tier",
			description: "The tier of the essence to add",
			type: ApplicationCommandOptionType.String,
			required: true,
			autocomplete: true // Enable autocomplete
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
		},
		{
			name: "quantity",
			description: "The amount to manipulate",
			type: ApplicationCommandOptionType.Integer,
			required: true
		}
	],

	async autocomplete(interactionCreate) {
		try {
			const { value, name } = interactionCreate.options.getFocused(true);

			// essence validation
			if (name === "essence-name") {
				if (value.length < 1) return;
				const essenceNames = await searchEssenceByName(value);
				const suggestedEssences = essenceNames.slice(0, 25).map(essence => ({
					name: essence,
					value: essence
				}));
				await interactionCreate.respond(suggestedEssences);

				// essence tier validation
			} else if (name === "essence-tier") {
				const essenceName = interactionCreate.options.getString("essence-name");
				// Check if essence name exists before proceeding
				if (!essenceName) {
					// If no essence name provided, return empty or a message
					return await interactionCreate.respond([
						{ name: "Please select an essence name first", value: "invalid" }
					]);
				}
				// Get the highest valid tier for this essence
				const highestTier = await fetchHighestValidTierByEssenceName(essenceName);

				// Generate tier options (1 to highest tier)
				const tierOptions = [];
				for (let i = 1; i <= highestTier; i++) {
					if (i.toString().includes(value)) {
						tierOptions.push({ name: `Tier ${i}`, value: i.toString() });
					}
				}
				await interactionCreate.respond(tierOptions);
			}
		} catch (error) {
			logError("Error in autocomplete for selling essence", error);
		}
	},

	async execute(interactionCreate, interactionAuthorID) {
		try {
			const selectedEssenceName = interactionCreate.options.getString("essence-name");
			const selectedEssenceTierOption = interactionCreate.options.getString("essence-tier");
			const selectedQuantity = parseInt(interactionCreate.options.getInteger("quantity"));
			const selectedAction = interactionCreate.options.getString("action");
			const highestTier = await fetchHighestValidTierByEssenceName(selectedEssenceName);

			if(selectedQuantity < 1) return await interactionCreate.reply({ flags: MessageFlags.Ephemeral, content: `Quantity must be valid.` });

			// Handle single tier option as before
			const selectedEssenceTier = parseInt(selectedEssenceTierOption);

			// checks if the provided essence could be found
			const essenceData = await fetchEssencesJsonDataByName(selectedEssenceName);
			if (!essenceData) {
				logInfo("Could Not find Essence", { selectedEssenceName, selectedEssenceTierOption });
				return await interactionCreate.reply({
					content: "The provided essence could not be found.",
					flags: MessageFlags.Ephemeral
				});
			}

			// checks if the provided essence tier exceeds the essence cap
			if (selectedEssenceTier > highestTier) {
				return await interactionCreate.reply({
					content: "The provided tier for the essence could not be found.",
					flags: MessageFlags.Ephemeral
				});
			}

			// checks if the tier and details for the tier of the essence could be found - also acts as our validation
			const tierDetails = essenceData[`${selectedEssenceTier}`];
			if (!tierDetails) {
				logInfo("Could Not find Essence Tier Details", { selectedEssenceName, selectedEssenceTier });
				return await interactionCreate.reply({
					content: "The provided tier for the essence could not be found.",
					flags: MessageFlags.Ephemeral
				});
			}

			const initialAmount = await sellListModel.getUserItemData(interactionAuthorID, `${selectedEssenceName} ${selectedEssenceTier}`) || 0;
			// register the data
			const embed = new EmbedBuilder();
			if(selectedAction === "Add") {
				await sellListModel.addItem(interactionAuthorID, `${selectedEssenceName} ${selectedEssenceTier}`, selectedQuantity);
				embed.setTitle(`Added ${selectedQuantity}`);
			} else {
				if(initialAmount < selectedQuantity || !initialAmount) return await interactionCreate.reply({ flags: MessageFlags.Ephemeral, content: `${selectedQuantity} exceeds ${initialAmount}` });
				await sellListModel.subtractItem(interactionAuthorID, `${selectedEssenceName} ${selectedEssenceTier}`, selectedQuantity);
				embed.setTitle(`Subtracted ${selectedQuantity}`);
			}

			const finalAmount = await sellListModel.getUserItemData(interactionAuthorID, `${selectedEssenceName} ${selectedEssenceTier}`);
			embed
			.setDescription(`You currently have ${finalAmount} ${selectedEssenceName} ${selectedEssenceTier} in your sell list.`)
			.setTimestamp();

			return await interactionCreate.reply({
				embeds: [embed],
				flags: MessageFlags.Ephemeral
			});
		} catch (error) {
			logError("error in sellEssence", error);
			return await interactionCreate.reply({
				content: "An error occurred while processing the request.",
				flags: MessageFlags.Ephemeral
			});
		}
	}
}