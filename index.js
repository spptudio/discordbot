const { Client, GatewayIntentBits, ChannelType } = require('discord.js');

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

// 🔥 중복 방지
const sentThreads = new Set();


// 🔁 starter message 재시도
async function getStarterMessage(thread, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const msg = await thread.fetchStarterMessage();
      if (msg) return msg;
    } catch {}

    await new Promise(res => setTimeout(res, 1000));
  }
  return null;
}


// 📩 알림 전송
async function sendAlert(thread) {
  try {
    if (!thread.parent) await thread.fetch();
    if (!thread.parent || !forumIds.includes(thread.parent.id)) return;

    if (thread.type !== ChannelType.PublicThread) return;

    if (sentThreads.has(thread.id)) return;
    sentThreads.add(thread.id);

    const targetChannel = await client.channels.fetch('1486620867512500254');

    const link = `https://discord.com/channels/${thread.guild.id}/${thread.id}`;

    const starterMessage = await getStarterMessage(thread);
    const content = starterMessage?.content || '(내용 없음)';

    await targetChannel.send(
      `✨ 새로운 작품이 등록되었어요 ✨
<@&1010225986748567684>
🔗 ${link}
📝 ${content}`
    );

  } catch (err) {
    console.log('에러:', err);
  }
}


// 🚀 생성 이벤트 (딜레이)
client.on('threadCreate', async (thread) => {
  setTimeout(async () => {
    await sendAlert(thread);
  }, 1500);
});


client.login(process.env.TOKEN);
