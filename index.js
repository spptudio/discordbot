const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

// ⭐ 여기 수정됨
client.once('clientReady', () => {
  console.log('봇 실행됨');
});

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
    // ⭐ 캐시 문제 방어
    if (!thread.parent) {
      await thread.fetch();
    }

    if (!thread.parent || !forumIds.includes(thread.parent.id)) return;

    // ⭐ 중복 방지
    if (sentThreads.has(thread.id)) return;
    sentThreads.add(thread.id);

    const targetChannel = await client.channels.fetch('1486620867512500254');

    const link = `https://discord.com/channels/${thread.guild.id}/${thread.id}`;

    await targetChannel.send(
      `<@&1010225986748567684> 새로운 작품이 등록되었어요✨\n${link}`
    );

  } catch (err) {
    console.log('에러 발생:', err);
  }
}

// ⭐ threadCreate (메인)
client.on('threadCreate', async (thread) => {
  console.log('threadCreate 감지');
  await sendAlert(thread);
});

// ⭐ messageCreate (백업)
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.channel.isThread()) return;

  console.log('messageCreate 감지');

  await sendAlert(message.channel);
});

client.login(process.env.TOKEN);

require('http').createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is alive');
}).listen(3000);
