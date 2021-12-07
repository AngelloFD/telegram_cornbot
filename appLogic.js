const { Telegraf } = require('telegraf')
const bot = new Telegraf('1759842853:AAF62w2jEicdxKe-imqAnWAuE8s72WA2CEw')

/* Comando /everyone 
Solo los admins
No considerar bots 
Hallar una forma de guardar los usuarios previamente ya registrados para el /everyone
*/

IDs = []
users = []

bot.command(['everyone', 'Everyone', 'EVERYONE'], (ctx) => {
    console.log(ctx.message)
    if (!(ctx.chat.type == 'private') && (IDs.length > 0) && (users.length > 0)) {
        msg = "Ring ring! " + ctx.message.from.username + " esta llamando a todos!\n"
        users.forEach(element => msg += "@" + element + " ")
        ctx.reply(msg)
        // userMSG = ctx.message.text
        // userMSGaray = userMSG.split(' ')
        /*if (userMSGaray[0].includes('/everyone') || userMSGaray[0].includes('/Everyone') || userMSGaray[0].includes('/EVERYONE')) {
            everyoneo.add(ctx.chat.id)
            setTimeout(() => {
                everyoneo.delete(ctx.chat.id)
            }, 86400000)
        }*/
    } else {
        ctx.reply("No hay nadie registrado / Funcion solo para grupos")
    }
})

/* To catch "almost" every username in the server | Must find a more efficient way.. | Yes, it detects bots bcuz lul */
bot.on('text', (ctx) => {
    if (ctx.message.reply_to_message) {
        if (users.includes(ctx.message.reply_to_message.from.username) == false && IDs.includes(ctx.message.reply_to_message.from.id) == false) {
            users.push(ctx.message.reply_to_message.from.username)
            IDs.push(ctx.message.reply_to_message.from.id)
        }
    } else {
        if (!(users.includes(ctx.message.from.username)) && !(IDs.includes(ctx.message.from.id))) {
            users.push(ctx.message.from.username)
            IDs.push(ctx.message.from.id)
        }
    }
    console.log(users)
})

bot.command(['pinga', 'Pinga', 'PINGA'], (ctx) => {
    msgArray = ctx.message.text.split(' ')
    msgArray.shift()
    adUser = msgArray.join(' ')

    ctx.reply(adUser + ' ¡' + ctx.from.first_name + ' requiere un pingaso con caracter de urgencia!')
    ctx.replyWithSticker('CAACAgEAAxkBAAIBZV_VptCTvUPTslR149fZ6rHZbLYIAAIfAAOd_dIVKoOiQA9vuYseBA')
})

bot.launch()