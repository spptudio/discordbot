const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ✅ 로그인 확인
client.once('ready', () => {
  console.log('봇 실행됨');
});

// ✅ 디버그 로그
client.on('threadCreate', (thread) => {
  console.log('🔥 threadCreate 발생:', thread.id);
});

client.on('messageCreate', (msg) => {
  console.log('🔥 messageCreate 발생');
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
    if (!thread.parent) {
      await thread.fetch();
    }

    if (!thread.parent || !forumIds.includes(thread.parent.id)) return;

    if (sentThreads.has(thread.id)) return;
    sentThreads.add(thread.id);

    const targetChannel = await client.channels.fetch('1486620867512500254');

    const link = `https://discord.com/channels/${thread.guild.id}/${thread.id}`;

    await targetChannel.send(
      `<@&1010225986748567684> 새로운 작품이 등록되었어요✨\n${link}`
    );

    console.log('✅ 알림 전송 완료');

  } catch (err) {
    console.log('❌ 에러 발생:', err);
  }
}

// 실제 이벤트 처리
client.on('threadCreate', async (thread) => {
  await sendAlert(thread);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.channel.isThread()) return;

  await sendAlert(message.channel);
});

// 로그인
client.login(process.env.TOKEN);

// Render용 서버
require('http').createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is alive');
}).listen(process.env.PORT || 3000);
