module.exports.sendSpecificChannel = async (channelId, messageContent) => {
	try {
		const channelToSend = await bot.channels.fetch(channelId);
		await channelToSend.send(messageContent);
	} catch (error) {
		console.error("Error sending direct message:", error);
	}
}