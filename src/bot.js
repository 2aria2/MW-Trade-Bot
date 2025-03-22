const { configurations } = require("../config/config.js");
const { Client, Collection } = require("discord.js");
const { readdirSync } = require("fs");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

// not sure why we would ever need sharding but why not
global.bot = new Client({
	intents: configurations.intents,
	shard: "auto"
});

bot.commands = new Collection();

// events
console.log("[bot]: loading events");
const eventDirs = readdirSync("./src/events");
for (dirs of eventDirs) {
	const perEventFile = readdirSync(`./src/events/${dirs}`).filter(file => file.endsWith(".js"));
	for (file of perEventFile) {
		const event = require(`./events/${dirs}/${file}`);
		console.log(`${new Date()} [Events Loaded]: ${file} from ${dirs}!`);
		bot.on(file.replace(".js", ""), event.bind(null, bot));
		delete require.cache[require.resolve(`./events/${dirs}/${file}`)];
	}
}

// commands
const commandDirs = readdirSync("./src/commands/");
commandsArray = []; // this array is for adding commands that will be sent to discord as a POST request
for (dirs of commandDirs) {
	let perMessageCommandFile = readdirSync(`./src/commands/${dirs}`);
	for (file of perMessageCommandFile) {
		const command = require(`./commands/${dirs}/${file}`);
		bot.commands.set(command.name.toLowerCase(), command);
		console.log(`${new Date()} [MessageCommands Loaded]: ${file} from ${dirs}!`);
		commandsArray.push(command);
		delete require.cache[require.resolve(`./commands/${dirs}/${file}`)];
	}
}

// sneding array upon bot emission of ready event
bot.on("ready", (bot) => {
	bot.application.commands.set(commandsArray);
});

console.log(`PID: ${process.pid}`);
process.traceDeprecation = true;
bot.login(process.env.DISCORD_TOKEN);