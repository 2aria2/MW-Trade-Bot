const { sendSpecificChannel } = require("../../service/botOwner/sendMessageSpecificChannel");
const { configurations } = require("../../../config/config.js");
const { MessageFlags, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = async ({ interactionCreate, buttonId }) => {
	try {
		// Verify if the user clicking is the one who created the command
		if (interactionCreate.user.id !== buttonId.userId) {
			return await interactionCreate.reply({
				content: "You can't use this button as you didn't create it.",
				flags: MessageFlags.Ephemeral
			});
		}

		const blockName = buttonId.block;
		console.log(`Block price flagged for: ${blockName}`);

		// Create disabled button
		const disabledButton = new ButtonBuilder()
			.setCustomId(interactionCreate.customId)
			.setLabel("Price Flagged")
			.setStyle(ButtonStyle.Danger)
			.setDisabled(true);

		const newActionRow = new ActionRowBuilder()
			.addComponents(disabledButton);

		// Send flag notification to specific channel
		await sendSpecificChannel(
			configurations.flagChannel,
			`Block price flagged for: ${blockName}\nFlagged by: ${interactionCreate.user.id}`
		);

		// Update the message with disabled button and send confirmation
		await interactionCreate.update({
			components: [newActionRow]
		});

		await interactionCreate.followUp({
			content: `Price for ${blockName} has been flagged for review.`,
			flags: MessageFlags.Ephemeral
		});
	} catch (error) {
		console.error("Error handling block price flag:", error);
		await interactionCreate.reply({
			content: "There was an error processing your flag.",
			flags: MessageFlags.Ephemeral
		});
	}
}