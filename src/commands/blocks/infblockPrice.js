const { searchBlockByName, fetchBlockData } = require("../../utils/jsonLookup/fetchByBlocks.js").InfBlocks;
const { ApplicationCommandOptionType, EmbedBuilder, MessageFlags } = require("discord.js");
const pricingEnums = require("../../../Data-Warehouse/pricingEnums.json");


module.exports = {
	name: "inf-block-price",
	aliases: [],
	category: "blocks",
	utilisation: "inf-block-price <block name>",
	description: "Shows the pricing details of the inf block price.",
	options: [
		{
			name: "block-name",
			description: "The name of the block to find",
			type: ApplicationCommandOptionType.String,
			required: true,
			autocomplete: true // Enable autocomplete
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
		} catch (error) {
			logError("Error in autocomplete for essence price", error);
		}
	},

	async execute(interactionCreate) {
		try {
			const selectedBlockName = interactionCreate.options.getString("block-name");
			const selectedBlockData = await fetchBlockData(selectedBlockName);
			if(!selectedBlockData) {
				logInfo("Could Not find Block", { selectedBlockName });
				return await interactionCreate.reply({
					content: "The provided block could not be found.",
					flags: MessageFlags.Ephemeral
				});
			}

			const embed = new EmbedBuilder();
			embed
				.setTitle(`Price of ${selectedBlockName}`)
				.setTimestamp()
				.setURL("https://docs.google.com/spreadsheets/d/1oQQdgtUN_ew87snt1bE3UBAmUBDESP96eShynjfpbj8/edit?gid=0#gid=0")
				.setFooter({ text: "Credits to the 'Infinity Block price chart by DjX and Patchika'." })
				.setDescription(`Price is: ` + pricingEnums.Blocks[selectedBlockData.Price]);

				await interactionCreate.reply({
					embeds: [embed],
					flags: MessageFlags.Ephemeral
				});
		} catch (error) {
			logError("error in infBlockPrice", error);
			return await interactionCreate.reply({
				content: "An error occurred while processing the request.",
				flags: MessageFlags.Ephemeral
			});
		}
	}
}