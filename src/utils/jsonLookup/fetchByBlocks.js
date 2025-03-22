importInfBlockJsonData = async () => {
	await delete require.cache[require.resolve("../../../Data-Warehouse/infBlocks.json")];
	const infBlocksJson = require("../../../Data-Warehouse/infBlocks.json");
	return infBlocksJson;
}

importBlocksAtSpawnJsonData = async () => {
	await delete require.cache[require.resolve("../../../Data-Warehouse/blockLocation.json")];
	const blockLocationJson = require("../../../Data-Warehouse/blockLocation.json");
	return blockLocationJson;
}

module.exports.InfBlocks = {
	searchBlockByName: async (name) => {
		const blockData = await importInfBlockJsonData();
		return blockData.filter(block => block["Block Name"].toLowerCase().trim().includes(name.toLowerCase().trim()));
	},
	fetchNameOfAllBlocksAsArray: async () => {
		const blockData = await importInfBlockJsonData();
		return blockData.map(block => block["Block Name"]);
	},
	fetchBlockData: async (name) => {
		const blockData = await importInfBlockJsonData();
		return blockData.find(block => block["Block Name"].toLowerCase().trim() === name.toLowerCase().trim());
	}
}

module.exports.BlocksAtSpawn = {
	fetchNameOfAllBlocksAsArray: async () => {
		const blockData = await importBlocksAtSpawnJsonData();
		return blockData.map(BlocksAtSpawnEntry => BlocksAtSpawnEntry.Block);
	},
	searchBlockByName: async (name) => {
		const blockData = await importBlocksAtSpawnJsonData(); // Ensure this returns valid data

		// the following type check line is only here because this is one of the lists im experimenting with automatic conversion with a DAX script via power BI
		if (!Array.isArray(blockData)) {
			logError("Expected an array, but got:", blockData);
			return [];
		}
		return blockData.filter(block => block && typeof block.Block === "string" && block.Block.toLowerCase().includes(name.toLowerCase()));
	},
	blockDataByName: async (name) => {
		const blockData = await importBlocksAtSpawnJsonData(); // Ensure this returns valid data
		if (!Array.isArray(blockData)) {
			logError("Expected an array, but got:", blockData);
			return [];
		}
		return blockData.find(block => block && typeof block.Block === "string" && block.Block.toLowerCase().trim() === name.toLowerCase().trim());
	}
}