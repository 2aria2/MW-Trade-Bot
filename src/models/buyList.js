const initializeDB = require("../database/database.js");

module.exports.buyListModel = {
	async addItem(discordUserId, itemName, itemQuantity = 1) {
		try {
			const db = await initializeDB();
			await db.add(`buy.${discordUserId}.${itemName}`, itemQuantity);
			logInfo("complete - buyListModel", { message: `buy.${discordUserId}.${itemName} - ${itemQuantity}` });
			
			const itemBuyers = await db.get(`buyers.${itemName}`);
			logInfo("complete - buyListModel", { message: `Retrieved buyers.${itemName}` });
			
			if (!itemBuyers || !itemBuyers.includes(discordUserId)) {
				await db.push(`buyers.${itemName}`, discordUserId);
				logInfo("complete - buyListModel", { message: `buyers.${itemName} - ${discordUserId}` });
			}
		} catch(error) {
			logError("error addingItem to buyList Model", { error, discordUserId, itemName, itemQuantity });
			throw error;
		}
	},
	async subtractItem(discordUserId, itemName, itemQuantity = 1) {
		try {
			const db = await initializeDB();
			const currentAmount = await db.get(`buy.${discordUserId}.${itemName}`);
			logInfo("complete - buyListModel", { message: `Retrieved buy.${discordUserId}.${itemName}: ${currentAmount}` });
			
			if(currentAmount && parseInt(currentAmount) >= itemQuantity) {
				await db.delete(`buy.${discordUserId}.${itemName}`);
				logInfo("complete - buyListModel", { message: `Deleted buy.${discordUserId}.${itemName}` });
				
				await db.pull(`buyers.${itemName}`, discordUserId);
				logInfo("complete - buyListModel", { message: `Removed ${discordUserId} from ${itemName}.buyers` });
			} else {
				await db.sub(`buy.${discordUserId}.${itemName}`, itemQuantity);
				logInfo("complete - buyListModel", { message: `Subtracted ${itemQuantity} from buy.${discordUserId}.${itemName}` });
			}
		} catch(error) {
			logError("error subtractItem to buyList Model", { error, discordUserId, itemName, itemQuantity });
			throw error;
		}
	},
	async findUsersByItem(itemName) {
		try {
			const db = await initializeDB();
			const buyers = await db.get(`buyers.${itemName}`);
			return buyers;
		} catch(error) {
			logError("error reading findUsersByItem from buyList Model", { error, itemName });
			throw error;
		}
	},
	async getAllUserItems(discordUserId) {
		try {
			const db = await initializeDB();
			const items = await db.get(`buy.${discordUserId}`) || [];
			return Object.entries(items).map(items => `${items[0]}: ${items[1]}`) || [];
		} catch(error) {
			logError("error reading getAllUserItems from buyList Model", { error, discordUserId });
			throw error;
		}
	},
	async getUserItemData(discordUserId, itemName) {
		try {
			const db = await initializeDB();
			const userData = await db.get(`buy.${discordUserId}.${itemName}`);
			return userData;
		} catch(error) {
			logError("error reading getUserItemData from buyList Model", { error, discordUserId, itemName });
			throw error;
		}
	},
	async getItemsForPurchase(itemName) {
		try {
			const db = await initializeDB();
			const itemsForSale = await db.get(`buyers`);
			return Object.keys(itemsForSale).filter(item => item && item.toLowerCase().trim().includes(itemName.toLowerCase().trim()));
		} catch(error) {
			logError("error reading getItemsForPurchase from buyList Model", { error });
			throw error;
		}
	},
	async getAllItemForPurchase() {
		try {
			const db = await initializeDB();
			const itemsForSale = await db.get(`buyers`) || [];
			return Object.keys(itemsForSale) || [];
		} catch(error) {
			logError("error reading getAllItemForPurchase from buyList Model", { error });
			throw error;
		}
	}
}