module.exports = {
	name: "ping",
	aliases: [],
	category: "core",
	utilisation: "ping",
	description: "Pong!",
	async execute(interactionCreate) {
		try {
			return interactionCreate.reply(`\nPing: ${Date.now() - interactionCreate.createdTimestamp} ms\nAPI latency: ${bot.ws.ping} ms`);
		} catch (error) {
			// Error handling
			await interactionCreate.reply({
				content: "An error occurred while processing the request.",
				flags: MessageFlags.Ephemeral
			});
			console.error(error);
		}
	}
}