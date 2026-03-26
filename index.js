const { Client, GatewayIntentBits } = require('discord.js');

// 🔥 HTTP 서버 먼저 실행 (핵심)
require('http').createServer((req, res) => {
  res.end('OK');
}).listen(process.env.PORT || 3000);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// 로그인 확인
client.once('ready', () => {
  console.log('봇 실행됨');
});

// 에러 확인
client.on('error', console.error);

const forumIds = [
  '1485230539290972231',
  '1245822867707396221',
  '1245808001818955806',
  '1282000814319075379',
  '1245812636822802552',
  '1245818716533293098',
  '1245821548682674268'
];

const sentThreads = new Set();

async function sendAlert(thread) {
  try {
    if (!thread.parent) await thread.fetch();
    if (!thread.parent || !forumIds.includes(thread.parent.id)) return;

    if (sentThreads.has(thread.id)) return;
    sentThreads.add(thread.id);

    const targetChannel = await client.channels.fetch('1486620867512500254');

    const link = `https://discord.com/channels/${thread.guild.id}/${thread.id}`;

    await targetChannel.send(`<@&1010225986748567684>\n${link}`);

  } catch (err) {
    console.log('에러:', err);
  }
}

client.on('threadCreate', async (thread) => {
  console.log('threadCreate 감지');
  await sendAlert(thread);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.channel.isThread()) return;

  console.log('messageCreate 감지');
  await sendAlert(message.channel);
});

// 🔥 로그인 마지막
client.login(process.env.TOKEN);
