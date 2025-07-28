require('dotenv/config');
const { Client, GatewayIntentBits } = require('discord.js');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
});

let personality = '  '; //place desired personality traits, instructions, and roles in the quotations

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const userCooldowns = new Map();
const COOLDOWN_TIME = 0.75 * 60 * 1000; //change the first number to 0 to remove the message rate limits, it represents minutes, so 2 for 2 minute timeout, 3 for 3, etc

const EXCEPTION_USER_ID = ''; 

client.on('ready', () => {
    console.log(`logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    if (!message.mentions.has(client.user)) return;

    const prompt = message.content.replace(`<@${client.user.id}>`, '').trim();
    if (!prompt) {
        message.reply('...');
        return;
    }

    const userId = message.author.id;

    if (userId === EXCEPTION_USER_ID) {
    } else {
        const now = Date.now();
        const lastUsed = userCooldowns.get(userId) || 0;

        if (now - lastUsed < COOLDOWN_TIME) {
            const remainingTime = (COOLDOWN_TIME - (now - lastUsed));
            const minutes = Math.floor(remainingTime / (60 * 1000));
            const seconds = Math.ceil((remainingTime % (60 * 1000)) / 1000);

            let timeString = '';
            if (minutes > 0) {
                timeString += `${minutes} minute${minutes !== 1 ? 's' : ''}`;
            }
            if (seconds > 0) {
                if (minutes > 0) timeString += ' and ';
                timeString += `${seconds} second${seconds !== 1 ? 's' : ''}`;
            }
            if (timeString === '') timeString = 'a moment';

            message.reply(`I'm rate limited, please try again in ${timeString}.`);
            return;
        }
    }

    try {
        await message.channel.sendTyping();
        const typingLoop = setInterval(() => {
            message.channel.sendTyping();
        }, 5000);

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    { role: 'user', parts: [{ text: `${personality}\n\nUser: ${prompt}` }] }
                ]
            })
        });

        const data = await response.json();
        clearInterval(typingLoop);

        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        
        
        if (reply) {
            message.reply(reply);
            if (userId !== EXCEPTION_USER_ID) {
                userCooldowns.set(userId, Date.now());
            }
        } else {
            
            message.reply('error 429: Gemini API quota exceeded');
            
            console.warn('Gemini response had no candidates or content:', JSON.stringify(data, null, 2)); //debugging
        }

    } catch (err) {
        
        console.error('error', err);
        message.reply('GEMINI API ERROR'); 
    }
});

client.login(process.env.TOKEN).catch(err => {
    console.error('failed to log in, check your token', err);
});