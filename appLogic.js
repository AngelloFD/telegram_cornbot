require('dotenv').config();

// const { Telegraf } = require('telegraf')
// const bot = new Telegraf(process.env.BOT_TOKEN)
const { Composer } = require('micro-bot')
const bot = new Composer()
const fs = require('fs')

function is_on_cooldown() {
    cooldown = false
    setTimeout(() => {
        cooldown = true
    }, 60000)
    return cooldown
}

bot.command('help', (ctx) => {
    ctx.reply('Comandos disponibles:', {
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
    ctx.reply('Comandos disponibles:', {
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

bot.command('everyone', (ctx) => {
    if (ctx.chat.type == 'private') {
        ctx.reply('Este comando solo está disponible en grupos')
    } else if (is_on_cooldown()) {
        console.log('on cooldown')
    } else {
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
        }
    }
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

bot.on('new_chat_members', (ctx) => {
    fs.appendFileSync('users.txt', '' + user)
})

bot.on('text', (ctx) => {
    fs.readFile('users.txt', 'utf8', (err, data) => {
        if (err) throw err;
        let users = data.split(' ')
        let user = ctx.message.from.username
        if (!(users.includes(user))) {
            fs.appendFileSync('users.txt', '' + user)
        }
    })
})
/* */

// bot.launch()
module.exports = bot