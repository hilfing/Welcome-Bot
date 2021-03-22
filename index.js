const Discord = require("discord.js");
const client = new Discord.Client();
const { token } = require('./config.json');

const newUsers = [];

client.on("ready", () => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    client.user.setPresence({
        status: "online",  // You can show online, idle... Do not disturb is dnd
        game: {
            name: "NEW USERS",  // The message shown
            type: "WATCHING" // PLAYING, WATCHING, LISTENING, STREAMING,
        }
    });
});

client.on("message", (message) => {
  if (message.content.startsWith("ping")) {
    message.channel.send("pong!");
  }
});

client.on("guildMemberAdd", (member) => {
  const guild = member.guild;
  if (!newUsers[guild.id]) newUsers[guild.id] = new Discord.Collection();
  newUsers[guild.id].set(member.id, member.user);

  if (newUsers[guild.id].size > 10) {
    const userlist = newUsers[guild.id].map(u => u.toString()).join(" ");
    guild.channels.find(channel => channel.name === "general").send("Welcome our new users!\n" + userlist);
    newUsers[guild.id].clear();
  }
});

client.on("guildMemberRemove", (member) => {
  const guild = member.guild;
  if (newUsers[guild.id].has(member.id)) newUsers.delete(member.id);
});

client.login(token);

// client
//  .on("debug", console.log)
//  .on("warn", console.log)