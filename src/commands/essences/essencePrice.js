const { searchEssenceByName, fetchHighestValidTierByEssenceName, fetchEssencesJsonDataByName } = require("../../utils/jsonLookup/fetchByEssences.js");
const { ApplicationCommandOptionType, EmbedBuilder, MessageFlags } = require("discord.js");
const pricingEnums = require("../../../Data-Warehouse/pricingEnums.json");

module.exports = {
	name: "essence-price",
	aliases: [],
	category: "essences",
	utilisation: "essence-price <essence name> <tier>",
	description: "Shows the pricing details of the essence price.",
	options: [
		{
			name: "essence-name",
			description: "The name of the essence to find",
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
				const tierOptions = [{ name: "All Tiers", value: "all" }];
				for (let i = 1; i <= highestTier; i++) {
					if (i.toString().includes(value)) {
						tierOptions.push({ name: `Tier ${i}`, value: i.toString() });
					}
				}
				await interactionCreate.respond(tierOptions);
			}
		} catch (error) {
			logError("Error in autocomplete for essence price", error);
		}
	},

	async execute(interactionCreate) {
		try {
			const selectedEssenceName = interactionCreate.options.getString("essence-name");
			const selectedEssenceTierOption = interactionCreate.options.getString("essence-tier");
			const highestTier = await fetchHighestValidTierByEssenceName(selectedEssenceName);

			// checks if the provided essence could be found
			const essenceData = await fetchEssencesJsonDataByName(selectedEssenceName);
			if (!essenceData) {
				logInfo("Could Not find Essence", { selectedEssenceName, selectedEssenceTierOption });
				return await interactionCreate.reply({
					content: "The provided essence could not be found.",
					flags: MessageFlags.Ephemeral
				});
			}

			const embed = new EmbedBuilder();
			embed
				.setTitle(`Price of ${selectedEssenceName}`)
				.setTimestamp()
				.setURL("https://docs.google.com/spreadsheets/d/1NreN_qK0pZ0KrREBt6c8M3P5o0c7qjcmf53OPgyYBcA/edit?pli=1&gid=0#gid=0")
				.setFooter({ text: "Credits to the 'Official Minewind Essence Price Charts (ChristieBot)'." });

			// If "all" option is selected, show all tiers
			if (selectedEssenceTierOption === "all") {
				let description = `Essence Tier Cap: ${highestTier}\n\n`;

				// Loop through all tiers and add to description
				// Why Loop through a fetch function? to prevent accidentally pulling null data
				for (let tier = 1; tier <= highestTier; tier++) {
					const tierDetails = essenceData[`${tier}`];
					if (tierDetails) {
						description += `Tier ${tier}: ${pricingEnums.Essences[`${tierDetails}`]}\n`;
					}
				}

				embed.setDescription(description);
			} else {
				// Handle single tier option as before
				const selectedEssenceTier = parseInt(selectedEssenceTierOption);

				// checks if the provided essence tier exceeds the essence cap
				if (selectedEssenceTier > highestTier) {
					return await interactionCreate.reply({
						content: "The provided tier for the essence could not be found.",
						flags: MessageFlags.Ephemeral
					});
				}

				// checks if the tier and details for the tier of the essence could be found
				const tierDetails = essenceData[`${selectedEssenceTier}`];
				if (!tierDetails) {
					logInfo("Could Not find Essence Tier Details", { selectedEssenceName, selectedEssenceTier });
					return await interactionCreate.reply({
						content: "The provided tier for the essence could not be found.",
						flags: MessageFlags.Ephemeral
					});
				}

				embed.setDescription(`Tier ${selectedEssenceTier}: ${pricingEnums.Essences[`${tierDetails}`]}\nEssence Tier Cap: ${highestTier}`);
			}

			await interactionCreate.reply({
				embeds: [embed],
				flags: MessageFlags.Ephemeral
			});
		} catch (error) {
			logError("error in essencesPrice", error);
			return await interactionCreate.reply({
				content: "An error occurred while processing the request.",
				flags: MessageFlags.Ephemeral
			});
		}
	}
}