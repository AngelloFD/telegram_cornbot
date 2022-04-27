require('dotenv').config();

const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)
const fs = require('fs')

// Comando help para mostrar los comandos disponibles en una inline keyboard
bot.command('help', (ctx) => {
    bot.telegram.sendMessage(ctx.chat.id, 'Comandos disponibles:', {
        reply_markup: {
            inline_keyboard: [
                [{ text: '/help', callback_data: 'callHelp' }, { text: '/pinga', callback_data: 'callPinga' }],
                [{ text: '/everyone', callback_data: 'callEveryone' }]
            ]
        }
    })
})

bot.action('callBack', (ctx) => {
    ctx.deleteMessage()
    bot.telegram.sendMessage(ctx.chat.id, 'Comandos disponibles:', {
        reply_markup: {
            inline_keyboard: [
                [{ text: '/help', callback_data: 'callHelp' }, { text: '/pinga', callback_data: 'callPinga' }],
                [{ text: '/everyone', callback_data: 'callEveryone' }]
            ]
        }
    })
})

bot.action('callHelp', (ctx) => {
    ctx.deleteMessage()
    ctx.replyWithMarkdown(`
    *Comando:* /help
    *Descripción:* Muestra los comandos disponibles
    `, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Atrás', callback_data: 'callBack' }]
            ]
        }
    })
})

bot.action('callEveryone', (ctx) => {
    ctx.deleteMessage()
    ctx.replyWithMarkdown(`
    *Comando:* /everyone
    *Descripción:* Llama a todos los usuarios
    *Intervalo de uso:* Cada 1 minuto 
    `, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Atrás', callback_data: 'callBack' }]
            ]
        }
    })
})
    
bot.action('callPinga', (ctx) => {
    ctx.deleteMessage()
    ctx.replyWithMarkdown(`
    *Comando:* /pinga
    *Descripción:* Anuncia tu horny
    *Uso adicional:* Agrega un @ para anunciarte a un usuario específico
    *Ejemplo:* /pinga @cornOfficialBot ó @cornOfficialBot /pinga
    `, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Atrás', callback_data: 'callBack' }]
            ]
        }
    })
})

// everyone command that reads the usernames from users.txt and sends a message with the usernames after an @ with nothing more
bot.command('everyone', (ctx) => {
    if (ctx.chat.type == 'private') {
        ctx.reply('Este comando solo está disponible en grupos')
    }

    if (fs.readFileSync('cooldowns.txt').toString() != '') {
        console.log("Command on cooldown")
    } else {
        // If the users.txt file is empty, do nothing
        if (fs.readFileSync('users.txt').toString() == "") {
            console.log("users.txt is empty")
        } else {
            fs.readFile('users.txt', 'utf8', (err, data) => {
                if (err) throw err;
                let users = data.split(' ')
                let message = 'Ring ring! ' + ctx.message.from.username + ' esta llamando a todos!\n'
                for (let i = 0; i < users.length; i++) {
                    message += '@' + users[i] + ' '
                }
                ctx.reply(message)
            })
            fs.appendFileSync('cooldowns.txt', ctx.from.id + '\n')
        }
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
    }

    // After 1 minute, remove the id of the user from the cooldowns.txt file
    setTimeout(() => {
        fs.readFile('cooldowns.txt', 'utf8', (err, data) => {
            if (err) throw err;
            let cooldowns = data.split(', ')
            let newCooldowns = ''
            for (let i = 0; i < cooldowns.length; i++) {
                if (cooldowns[i] != ctx.from.id) {
                    newCooldowns += cooldowns[i] + '\n'
                }
            }
            fs.writeFile('cooldowns.txt', newCooldowns, (err) => {
                if (err) throw err;
            })
        })
    }, 60000)

})

bot.command(['pinga', 'Pinga', 'PINGA'], (ctx) => {
    if (ctx.chat.type == 'private') {
        ctx.reply('Este comando solo está disponible en grupos')
    }
    
    msgArray = ctx.message.text.split(' ')
    msgArray.shift()
    adUser = msgArray.join(' ')

    ctx.reply(adUser + ' ¡' + ctx.from.first_name + ' requiere un pingaso con carácter de urgencia!')
    new Promise(r => setTimeout(r, 2000))
    ctx.replyWithSticker('CAACAgEAAxkBAAIBZV_VptCTvUPTslR149fZ6rHZbLYIAAIfAAOd_dIVKoOiQA9vuYseBA')
})

// Save the ID of all the users in the chat in data.txt
bot.on('new_chat_members', (ctx) => {
    fs.appendFileSync('users.txt', '' + user)
})

bot.on('text', (ctx) => {
    // read the users.txt file and check if the user that sent the message is in the file.
    fs.readFile('users.txt', 'utf8', (err, data) => {
        if (err) throw err;
        let users = data.split(' ')
        let user = ctx.message.from.username
        if (!(users.includes(user))) {
            // if the user is not in the file, add it to the file
            fs.appendFileSync('users.txt', '' + user)
        }
    })
})
/* */

bot.launch()