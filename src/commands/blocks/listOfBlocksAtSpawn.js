const { Pagination } = require("pagination.djs");
const { fetchNameOfAllBlocksAsArray } = require("../../utils/jsonLookup/fetchByBlocks.js").BlocksAtSpawn;
const { EmbedBuilder, MessageFlags } = require("discord.js");


module.exports = {
	name: "all-blocks-at-spawn",
	aliases: [],
	category: "blocks",
	utilisation: "all-blocks-at-spawn",
	description: "Returns a list of all blocks at spawn.",
	async execute(interactionCreate) {
		try {
			const namesOfBlocks = await fetchNameOfAllBlocksAsArray();

			// pagination
			const pagination = new Pagination(interactionCreate, { ephemeral: true });
			const embeds = [];
			const NumberOfPages = Math.ceil(namesOfBlocks.length / 30);

			for (let i = 0; i < NumberOfPages; ++i) {
				const startIndex = i * 30;
				const endIndex = Math.min(startIndex + 30, namesOfBlocks.length);
				const pageBlocks = namesOfBlocks.slice(startIndex, endIndex);
			
				const newEmbed = new EmbedBuilder()
					.setTitle(`List of blocks at Spawn`)
					.setDescription(pageBlocks.join("\n"));
			
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
		} catch(error) {
			logError("error in all-blocks-at-spawn", error);
			return await interactionCreate.reply({
				content: "An error occurred while processing the request.",
				flags: MessageFlags.Ephemeral
			});
		}
	}
}