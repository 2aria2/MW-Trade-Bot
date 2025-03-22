const initializeDB = require("../database/database.js");

module.exports.sellListModel = {
	async addItem(discordUserId, itemName, itemQuantity = 1) {
		try {
			const db = await initializeDB();
			await db.add(`sell.${discordUserId}.${itemName}`, itemQuantity);
			logInfo("complete - sellListModel", { message: `sell.${discordUserId}.${itemName} - ${itemQuantity}` });
			
			const itemSellers = await db.get(`sellers.${itemName}`);
			logInfo("complete - sellListModel", { message: `Retrieved sellers.${itemName}` });
			
			if (!itemSellers || !itemSellers.includes(discordUserId)) {
				await db.push(`sellers.${itemName}`, discordUserId);
				logInfo("complete - sellListModel", { message: `sellers.${itemName} - ${discordUserId}` });
			}
		} catch(error) {
			logError("error addingItem to sellList Model", { error, discordUserId, itemName, itemQuantity });
			throw error;
		}
	},
	async subtractItem(discordUserId, itemName, itemQuantity = 1) {
		try {
			const db = await initializeDB();
			const currentAmount = await db.get(`sell.${discordUserId}.${itemName}`);
			logInfo("complete - sellListModel", { message: `Retrieved sell.${discordUserId}.${itemName}: ${currentAmount}` });
			
			if(currentAmount && parseInt(currentAmount) >= itemQuantity) {
				await db.delete(`sell.${discordUserId}.${itemName}`);
				logInfo("complete - sellListModel", { message: `Deleted sell.${discordUserId}.${itemName}` });
				
				await db.pull(`sellers.${itemName}`, discordUserId);
				logInfo("complete - sellListModel", { message: `Removed ${discordUserId} from ${itemName}.sellers` });
			} else {
				await db.sub(`sell.${discordUserId}.${itemName}`, itemQuantity);
				logInfo("complete - sellListModel", { message: `Subtracted ${itemQuantity} from sell.${discordUserId}.${itemName}` });
			}
		} catch(error) {
			logError("error subtractItem to sellList Model", { error, discordUserId, itemName, itemQuantity });
			throw error;
		}
	},
	async findUsersByItem(itemName) {
		try {
			const db = await initializeDB();
			const sellers = await db.get(`sellers.${itemName}`) || [];
			return sellers;
		} catch(error) {
			logError("error reading findUsersByItem from sellList Model", { error, itemName });
			throw error;
		}
	},
	async getAllUserItems(discordUserId) {
		try {
			const db = await initializeDB();
			const items = await db.get(`sell.${discordUserId}`) || [];
			return Object.entries(items).map(items => `${items[0]}: ${items[1]}`);
		} catch(error) {
			logError("error reading getAllUserItems from sellList Model", { error, discordUserId });
			throw error;
		}
	},
	async getUserItemData(discordUserId, itemName) {
		try {
			const db = await initializeDB();
			const userData = await db.get(`sell.${discordUserId}.${itemName}`);
			return userData;
		} catch(error) {
			logError("error reading getUserItemData from sellList Model", { error, discordUserId, itemName });
			throw error;
		}
	},
	async getItemsForSale(itemName) {
		try {
			const db = await initializeDB();
			const itemsForSale = await db.get(`sellers`) || [];
			return Object.keys(itemsForSale).filter(item => item && item.toLowerCase().trim().includes(itemName.toLowerCase().trim())) || [];
		} catch(error) {
			logError("error reading getItemsForSale from sellList Model", { error });
			throw error;
		}
	},
	async getAllItemsForSale() {
		try {
			const db = await initializeDB();
			const itemsForSale = await db.get(`sellers`) || [];
			return Object.keys(itemsForSale) || [];
		} catch(error) {
			logError("error reading getAllItemsForSale from sellList Model", { error });
			throw error;
		}
	}
}