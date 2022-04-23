require('dotenv').config();

const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)
const fs = require('fs')

// everyone command that reads the usernames from users.txt and sends a message with the usernames after an @ with nothing more
bot.command('everyone', (ctx) => {
    // while not on cooldown, execute the command
    fs.readFile('users.txt', 'utf8', (err, data) => {
        if (err) throw err;
        let users = data.split(' ')
        let message = 'Ring ring! ' + ctx.message.from.username + ' esta llamando a todos!\n'
        for (let i = 0; i < users.length; i++) {
            message += '@' + users[i] + ' '
        }
        ctx.reply(message)
    })
})

bot.command(['pinga', 'Pinga', 'PINGA'], (ctx) => {
    msgArray = ctx.message.text.split(' ')
    msgArray.shift()
    adUser = msgArray.join(' ')

    ctx.reply(adUser + ' ¡' + ctx.from.first_name + ' requiere un pingaso con caracter de urgencia!')
    new Promise(r => setTimeout(r, 2000))
    ctx.replyWithSticker('CAACAgEAAxkBAAIBZV_VptCTvUPTslR149fZ6rHZbLYIAAIfAAOd_dIVKoOiQA9vuYseBA')
})

// Save the ID of all the users in the chat in data.txt
bot.on('new_chat_members', (ctx) => {
    fs.writeFileSync('data.txt', JSON.stringify(IDs))
    fs.writeFileSync('users.txt', JSON.stringify(users))
})

bot.on('text', (ctx) => {
    // read the users.txt file and check if the user that sent the message is in the file.
    fs.readFile('users.txt', 'utf8', (err, data) => {
        if (err) throw err;
        let users = data.split(' ')
        let user = ctx.message.from.username
        if (!(users.includes(user))) {
            // if the user is not in the file, add it to the file
            fs.appendFileSync('users.txt', ' ' + user)
        }
    })
})
/* */

bot.launch()