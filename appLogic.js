require('dotenv').config();

const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)

IDs = []
users = []

bot.command(['everyone', 'Everyone', 'EVERYONE'], (ctx) => {
    console.log("Test")
    if (!(ctx.chat.type == 'private') && (IDs.length > 0) && (users.length > 0)){
        msg = "Ring ring! " + ctx.message.from.username + " esta llamando a todos!\n"
        users.forEach(element => msg += "@" + element + " ")
        ctx.reply(msg)
    }
})

bot.command(['pinga', 'Pinga', 'PINGA'], (ctx) => {
    msgArray = ctx.message.text.split(' ')
    msgArray.shift()
    adUser = msgArray.join(' ')

    ctx.reply(adUser + ' ¡' + ctx.from.first_name + ' requiere un pingaso con caracter de urgencia!')
    new Promise(r => setTimeout(r, 2000))
    ctx.replyWithSticker('CAACAgEAAxkBAAIBZV_VptCTvUPTslR149fZ6rHZbLYIAAIfAAOd_dIVKoOiQA9vuYseBA')
})

/* Saving IDs and usernames */
bot.on('new_chat_members', (ctx) => {
    IDs.push(ctx.message.new_chat_member.id)
    users.push(ctx.message.new_chat_member.username)
})

bot.on('text', (ctx) => {
    if (!(users.includes(ctx.message.from.username)) && !(IDs.includes(ctx.message.from.id)) && ctx.message.from.is_bot == false) {
        users.push(ctx.message.from.username)
        IDs.push(ctx.message.from.id)
    }
})
/* */

bot.launch()