const { Pagination } = require("pagination.djs");
const { fetchEssencesNameAsArray } = require("../../utils/jsonLookup/fetchByEssences.js");
const { ApplicationCommandOptionType, EmbedBuilder, MessageFlags } = require("discord.js");

module.exports = {
	name: "essences-by-keys",
	aliases: [],
	category: "essences",
	utilisation: "essnces-by-keys <key name>",
	description: "Returns essences by keys.",
	options: [
		{
			name: "key",
			description: "key name",
			type: ApplicationCommandOptionType.String,
			required: true,
			choices: [
				{ name: "chaos", value: "chaos" },
				{ name: "tempest", value: "tempest" },
				{ name: "inferno", value: "inferno" },
				{ name: "paradox", value: "paradox" },
				{ name: "dimensional", value: "dimensional" }
			]
		}
	],
	async execute(interactionCreate) {
		try {
		// fetching essences by options
			const keyArgument = interactionCreate.options.getString("key");
			const essences = await fetchEssencesNameAsArray(item => item.value.key === keyArgument); // Fixed filter function

			// pagination
			const pagination = new Pagination(interactionCreate, { ephemeral: true });
			const embeds = [];
			const NumberOfPages = Math.ceil(essences.length / 30);

			for (let i = 0; i < NumberOfPages; ++i) {
				const startIndex = i * 30;
				const endIndex = Math.min(startIndex + 30, essences.length);
				const pageEssences = essences.slice(startIndex, endIndex);
			
				const newEmbed = new EmbedBuilder()
					.setTitle(`Essences with key: ${keyArgument}`)
					.setDescription(pageEssences.join("\n"));
			
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
			logError("error in essencesByKey", error);
			return await interactionCreate.reply({
				content: "An error occurred while processing the request.",
				flags: MessageFlags.Ephemeral
			});
		}
	}
}