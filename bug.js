const Discord = require('discord.js')
const bot = new Discord.Client()

const token = ""

bot.on('ready', () => {
    console.log("ID: "+bot.user.id+"\nUsername: "+bot.user.username+"\nServers: "+bot.guilds.size+"\nBot: "+bot.user.bot)
})

bot.login(token)