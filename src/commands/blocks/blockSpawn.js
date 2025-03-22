const { ApplicationCommandOptionType, EmbedBuilder, MessageFlags } = require("discord.js");
const { searchBlockByName, blockDataByName } = require("../../utils/jsonLookup/fetchByBlocks.js").BlocksAtSpawn;

module.exports = {
	name: "block-at-spawn",
	aliases: [],
	category: "blocks",
	utilisation: "block-at-spawn <block name>",
	description: "Shows the spawn location of the block.",
	options: [
		{
			name: "block-name",
			description: "The name of the block to find",
			type: ApplicationCommandOptionType.String,
			required: true,
			autocomplete: true
		}
	],

	async autocomplete(interactionCreate) {
		try {
			const { value, name } = interactionCreate.options.getFocused(true);

			if (name === "block-name") {
				if (value.length < 1) return;
				const blockNames = await searchBlockByName(value);
				const suggestedBlocks = blockNames.slice(0, 25).map(blocks => ({
					name: blocks.Block,
					value: blocks.Block
				}));
				await interactionCreate.respond(suggestedBlocks);
			}
		} catch (error) {
			logError("Error in autocomplete for block location", error);
		}
	},

	async execute(interactionCreate) {
		try {
			const selectedBlockName = interactionCreate.options.getString("block-name");
			const selectedBlockData = await blockDataByName(selectedBlockName);
			if(!selectedBlockData) {
				return await interactionCreate.reply({
					content: "We could not find the block you provided.",
					flags: MessageFlags.Ephemeral
				});
			}
			const { Location, Coordinates, Tool, Misc, Credits } = selectedBlockData;
			const embed = new EmbedBuilder();
			embed
			.setTitle(`${selectedBlockName}'s location in spawn!`)
			.addFields(
				{ name: "Location", value: Location || "no information" },
				{ name: "Coordinates", value: Coordinates || "no information" },
				{ name: "Tool", value: Tool || "no information" },
				{ name: "Misc", value: Misc || "no information" },
				{ name: "Credits", value: Credits || "no information" }
			)
			.setURL("https://docs.google.com/spreadsheets/d/14ew0SrKFE8DylcIoP6ceoSi5LG8Crd3ZPWrP0b5IUv0/edit?gid=1205246388#gid=1205246388")
			.setFooter({ text: "Credits to 'Crubleigh's big ol list of blocks you can steal from spawn mk2'." })
			.setTimestamp();

			await interactionCreate.reply({
				embeds: [embed],
				flags: MessageFlags.Ephemeral
			});
		} catch (error) {
			logError("error in blockSpawn", error);
			return interactionCreate.reply({
				content: "An error occurred while processing the request.",
				flags: MessageFlags.Ephemeral
			});
		}
	}
}