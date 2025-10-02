require('dotenv').config();

const { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard } = require('grammy');


const { hydrate } = require('@grammyjs/hydrate')

const bot = new Bot(process.env.BOT_API_KEY);
bot.use(hydrate());

bot.api.setMyCommands([
    {
        command: 'start',
        description: 'Start the bot'
    },
    {
        command: 'shop',
        description: 'Сделать заказ'
    },
    {
        command: 'menu',
        description: 'Получить меню'
    }
    /*
    {
        command: 'mood',
        description: 'Узнать настроение'
    },
    {
        command: 'share',
        description: 'Узнать настроение'
    },
    {
        command: 'inline_keyboard',
        description: 'inline_keyboard'
    }*/
])

bot.command('shop', async (ctx) => {
    console.log(ctx);
    ctx.reply('<a href="https://t.me/+-5u7rUm-7LZlMzAy">Магазин</a>', { parse_mode: "HTML"})
});

bot.command('share', async (ctx) => {
    console.log(ctx);
    ctx.reply('<a href="https://t.me/+-5u7rUm-7LZlMzAy">Магазин</a>', { parse_mode: "HTML"})
    const shareKeyboard = new Keyboard().requestLocation("Геолокация").requestContact("Контакт").requestPoll("Опрос").resized()

    await ctx.reply("Чем хочешь поделиться?", {
        reply_markup: shareKeyboard
    })
});

bot.command('inline_keyboard', async (ctx) => {
    console.log(ctx);
    const inlineKeyboard = new InlineKeyboard()
        .url("Перейти в магазин", "https://t.me/+-5u7rUm-7LZlMzAy") 

    await ctx.reply("Выьерите цифру", {
        reply_markup: inlineKeyboard
    })
});

bot.callbackQuery(["Button_1", "Button_2", "Button_3"], async (ctx) => {
    await ctx.answerCallbackQuery('Вы выбрали цифру!')
    await ctx.reply('Вы выбрали цифру')
})


bot.command('mood', async (ctx) => {
    console.log(ctx);

    const moodLabels = ['Хорошо', 'Норм', 'Плохо']
    const rows = moodLabels.map(label => {
        return Keyboard.text(label)
    })

    const moodKeyboard = Keyboard.from(rows).resized()

    await ctx.reply("Как настроение?", {
        reply_markup: moodKeyboard
    })
});

bot.hears('Хорошо',async (ctx) => {
    await ctx.reply("Класс!", {
        reply_markup: { remove_keyboard: true }
    })
});

bot.on(':voice', async (ctx) => {
    console.log(ctx);
    await ctx.reply('pin')
    ctx.reply('I got audio')
});

bot.hears('', async (ctx) => {
    console.log(ctx);
    ctx.reply('ping')
});


bot.on(':voice', async (ctx) => {
    console.log(ctx);
    ctx.reply('I got audio')
});

bot.on('::url', async (ctx) => {
    console.log(ctx);
    ctx.reply('I got url')
});

bot.command('start', async (ctx) => {
    console.log(ctx);
    ctx.reply('Hello! I am SX Wine Bot')
});

bot.command(['say_hello', 'hi'], async (ctx) => {
    console.log(ctx);
    ctx.reply('Hello!')
});

/*
bot.on('message', async (ctx) => {
    console.log(ctx);
    ctx.reply('I will think about it')
});
*/

bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error for ${ctx.update.update_id}:`);
    const e = err.error
    if(e instanceof GrammyError) {
        console.error(`Error in request: ${e.description}`);
    } else if(e instanceof HttpError) {
        console.error(`Failed to connect Telegram: ${e.message}`);
    } else {
        console.error(`Error: ${err.message}`);
    }
});

bot.start();