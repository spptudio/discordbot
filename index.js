const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

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

// 🔥 중복 방지용
const sentThreads = new Set();

async function sendAlert(thread) {
  try {
    if (!thread.parent) await thread.fetch();
    if (!thread.parent || !forumIds.includes(thread.parent.id)) return;

    // ✅ 중복 방지
    if (sentThreads.has(thread.id)) return;
    sentThreads.add(thread.id);

    const targetChannel = await client.channels.fetch('1486620867512500254');

    const link = `https://discord.com/channels/${thread.guild.id}/${thread.id}`;

    // 🔥 글 내용 가져오기 (첫 메시지)
    let content = '';
    try {
      const starterMessage = await thread.fetchStarterMessage();
      content = starterMessage?.content || '';
    } catch {}

    await targetChannel.send(
      `<@&1010225986748567684>\n${link}\n\n${content}`
    );

  } catch (err) {
    console.log('에러:', err);
  }
}

// ✅ threadCreate만 사용 (중복 원인 제거)
client.on('threadCreate', async (thread) => {
  await sendAlert(thread);
});

// ❌ messageCreate 제거 (중복 원인)
client.login(process.env.TOKEN);
