const { Telegraf } = require('telegraf')
const bot = new Telegraf('1759842853:AAF62w2jEicdxKe-imqAnWAuE8s72WA2CEw')

IDs = []
users = []
history = []
const everyoneo = new Set()
ACTIVATE = false

// bot.command('config', (ctx) => {
//     if (ctx.message.from.status == "creator" || ctx.message.from.status == "administrator") {
//         ctx.reply('¡Atención! Este comando no te funcionará si es que no me mandaste un mensaje al PRIVADO con la palabra /start, ' + ctx.message.from.username, {
//             reply_markup: {
//                 inline_keyboard: [
//                     [{ text: "Toca aquí", url: "https://t.me/seguroOficialbot" }]
//                 ]
//             }
//         })
//         newID = ctx.message.from.id
//         ctx.telegram.sendMessage(newID, '¡Hey! Bienvenido al menú de ayuda. Selecciona la opción que deseas usar',
//             {
//                 reply_markup: {
//                     inline_keyboard: [
//                         [{ text: "Activar", callback_data: "AC" }],
//                     ]
//                 }
//             })
//     }
//     // if (ctx.message.from)
//     // ACTIVATE = true
//     // console.log(ACTIVATE)
// })

bot.command(['Mimir', 'mimir', 'MIMIR'], (ctx) => {
    if (ctx.message.reply_to_message) {
        ctx.reply('@' + ctx.message.reply_to_message.from.username + ' a mimir')
        ctx.replyWithVideo('BAACAgEAAxkBAAIBb1_VqFgG3SGyp4uXJ6yCguOBazExAAJaAQAC9meYRYbzzKKAjZpkHgQ')
    } else {
        ctx.replyWithVideo('BAACAgEAAxkBAAIBb1_VqFgG3SGyp4uXJ6yCguOBazExAAJaAQAC9meYRYbzzKKAjZpkHgQ')
    }
})

bot.command(['mimirnt', 'unmimir', 'despertar', 'Despertar'], (ctx) => {
    if (ctx.message.reply_to_message) {
        ctx.reply('@' + ctx.message.reply_to_message.from.username + ' a unmimir')
        ctx.replyWithVideo('BAACAgEAAxkBAAIBdF_VqYv-cTP2_5wC5Z7sO0BPfmw1AAK9AAPp18BFQwwvRotlSbIeBA')
    } else {
        ctx.replyWithVideo('BAACAgEAAxkBAAIBdF_VqYv-cTP2_5wC5Z7sO0BPfmw1AAK9AAPp18BFQwwvRotlSbIeBA')
    }
})

bot.command(['pinga', 'Pinga', 'PINGA'], (ctx) => {
    msgArray = ctx.message.text.split(' ')
    msgArray.shift()
    adUser = msgArray.join(' ')

    ctx.reply(adUser + ' ¡' + ctx.from.first_name + ' requiere un pingaso con caracter de urgencia!')
    ctx.replyWithSticker('CAACAgEAAxkBAAIBZV_VptCTvUPTslR149fZ6rHZbLYIAAIfAAOd_dIVKoOiQA9vuYseBA')
})

/* Only if ACTIVATE is true */
bot.command(['everyone', 'Everyone', 'EVERYONE'], (ctx) => {
    if (ctx.chat.type == 'private' == false) {
        if (everyoneo.has(ctx.chat.id)) { } else {
            msg = "Ring ring! " + ctx.message.from.username + " esta llamando a todos!\n"
            users.forEach(element => msg += "@" + element + " ")
            ctx.reply(msg)
            userMSG = ctx.message.text
            userMSGaray = userMSG.split(' ')
            if (userMSGaray[0].includes('/everyone') || userMSGaray[0].includes('/Everyone') || userMSGaray[0].includes('/EVERYONE')) {
                everyoneo.add(ctx.chat.id)
                setTimeout(() => {
                    everyoneo.delete(ctx.chat.id)
                }, 86400000)
            }
        }
    } else {
        ctx.reply("Funcion solo para grupos")
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
        if (users.includes(ctx.message.from.username) == false && IDs.includes(ctx.message.from.id) == false) {
            users.push(ctx.message.from.username)
            IDs.push(ctx.message.from.id)
        }
    }
})

bot.on('new_chat_members', (ctx) => {
    if (ctx.message.new_chat_members[0].is_bot) {
        console.log("Bot joined")
        if (users.includes(ctx.message.new_chat_members[0].username) == false && IDs.includes(ctx.message.new_chat_members[0].id) == false) {
            users.push(ctx.message.new_chat_members[0].username)
        }
    } else {
        if (users.includes(ctx.message.new_chat_members[0].username) == false && IDs.includes(ctx.message.new_chat_members[0].id) == false) {
            // ctx.reply('Bienvenido @' + ctx.message.new_chat_members[0].username + ' a ' + ctx.chat.title)
            users.push(ctx.message.new_chat_members[0].username)
            IDs.push(ctx.message.new_chat_members[0].id)
            if (history.includes(ctx.message.new_chat_members[0].username) == false) {
                history.push(ctx.message.new_chat_members[0].username)
                ctx.reply('Bienvenido @' + ctx.message.new_chat_members[0].username + ' a ' + ctx.chat.title)
            } else {
                ctx.reply('Bienvenido de vuelta @' + ctx.message.new_chat_members[0].username)
            }
        }
    }
})

bot.on('left_chat_member', (ctx) => {
    if (ctx.message.left_chat_member[0].is_bot) {
        console.log("A bot left/got banned")
        users.splice(users.indexOf(ctx.message.left_chat_member[0].username, 1))
    } else {
        if (users.includes(ctx.message.left_chat_member[0].username) && IDs.includes(ctx.message.left_chat_member[0].id)) {
            users.splice(users.indexOf(ctx.message.left_chat_member[0].username, 1))
            IDs.splice(IDs.indexOf(ctx.message.left_chat_member[0].id), 1)
        }
    }
})

bot.launch()