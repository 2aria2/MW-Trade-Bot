const { GatewayIntentBits } = require("discord.js");

const configurations = {
	addlink: "https://discord.com/oauth2/authorize?client_id=1302479601657712670&permissions=18432&integration_type=0&scope=applications.commands+bot",
	intents: [
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildWebhooks,
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.DirectMessageTyping,
		GatewayIntentBits.GuildIntegrations,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessageTyping,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildScheduledEvents,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.AutoModerationConfiguration,
		GatewayIntentBits.AutoModerationExecution,
		GatewayIntentBits.GuildModeration
	],
	botOwnerId: "875324148874895400",
	flagChannel: "1338586645158432811",
	buttonInteractionExpiry: 3 * 60 * 1000,
	max_int: 2147483648
}

module.exports = { configurations }