module.exports.directMessageBotOwner = async (userId, messageContent) => {
	try {
		const user = await bot.users.fetch(userId);
		await user.send(messageContent);
	} catch (error) {
		console.error("Error sending direct message:", error);
	}
}