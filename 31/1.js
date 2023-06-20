const {Telegraf} = require('telegraf');
const bot = new Telegraf('6152684492:AAEpSjIACuEAF6mr0n6XIQxkT61dbj5zjLc');
bot.command('start', ctx => {
    bot.telegram.sendMessage(ctx.chat.id, 'Приветствую!', {})
});
bot.on('text', ctx => {
    bot.telegram.sendMessage(ctx.chat.id, 'echo: ' + ctx.message.text, {})
});
bot.launch();

