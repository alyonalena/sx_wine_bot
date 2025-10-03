require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard } = require('grammy');

const bot = new Bot(process.env.BOT_API_KEY);

const app = express();

app.use(express.json());
app.use(cors());


//---------Bot Logic---------

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
        command: 'send_msg_to_admin',
        description: 'Отправить сообщение админу'
    }
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

bot.command('send_msg_to_admin', async (ctx) => {

    await bot.api.sendMessage(process.env.ADMIN_CHAT_ID, `Запрос от пользователя ${ctx.msg.chat.username}`);

    await ctx.reply('Запрос админу отправлен')
});

bot.command('inline_keyboard', async (ctx) => {
    console.log(ctx);
    const inlineKeyboard = new InlineKeyboard()
        .url("Перейти в магазин", "https://t.me/")

    await ctx.reply("Выберите цифру", {
        reply_markup: inlineKeyboard
    })
});

bot.callbackQuery(["Button_1", "Button_2", "Button_3"], async (ctx) => {
    await ctx.answerCallbackQuery('Вы выбрали цифру!')
    await ctx.reply('Вы выбрали цифру')
})


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

//---------request from MiniApp---------

app.post('/web-data', async (req, res) => {
    console.log(req.body)

   try {
        await bot.api.sendMessage(
            process.env.ADMIN_CHAT_ID, 
            `!!! Пользователь ${req.body.userName} интересуется вином ${req.body.wineInfo}`
        );
        return res.status(200).json({});
    } catch (e) {
        return res.status(500).json({})
    }
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log('server started on PORT ' + PORT))