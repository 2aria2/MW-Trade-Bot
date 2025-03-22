const { configurations } = require("../../../config/config.js");

module.exports.directMessageBotOwner = async (messageContent) => {
	try {
		const user = await bot.users.fetch(configurations.botOwnerId);
		await user.send(messageContent);
	} catch (error) {
		console.error("Error sending direct message:", error);
	}
}

// Usage example
// sendDirectMessage('123456789', 'Your message here');