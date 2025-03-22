importJsonData = async () => {
	await delete require.cache[require.resolve("../../../Data-Warehouse/essences.json")];
	const essenceJson = require("../../../Data-Warehouse/essences.json");
	return essenceJson;
},

module.exports = {
	// useful for filtration and other related operations
	fetchEssencesAsArray: async (filterData) => {
		const essenceJson = await importJsonData();
		return Object.entries(essenceJson).map(([keyName, value]) => {
			return { keyName, value };
		}).filter(filterData);
	},
	fetchEssencesNameAsArray: async (filterFunction) => {
		const essenceJson =  await importJsonData();
		return Object.entries(essenceJson)
			.map(([keyName, value]) => ({ keyName, value }))
			.filter(filterFunction)
			.map(item => item.keyName);
	},
	// generic fetch function
	fetchEssencesJsonDataByName: async (name) => {
		const essenceJson =  await importJsonData();
		return essenceJson[`${name}`];
	},
	// this is for auto correct and more
	fetchHighestValidTierByEssenceName: async (name) => {
		const essenceJson = await importJsonData();
		const essenceCap = essenceJson[`${name}`]["Essence Cap"];
		if(essenceCap === null) return 1;
		else return essenceCap;
	},
	// auto complete for essence names - slicing of first 25 will be done on the autocomplete function
	searchEssenceByName: async (name) => {
		const essenceJson = await importJsonData();
		const arrayOfEssenceNames = Object.keys(essenceJson).filter(essence => essence && typeof essence === "string" && essence.toLowerCase().trim().includes(name.toLowerCase().trim()));
		return(arrayOfEssenceNames)
	}
}