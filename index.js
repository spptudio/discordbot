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


// 🔁 starter message 안전하게 가져오기 (재시도)
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


// 📩 알림 보내기
async function sendAlert(thread) {
  try {
    if (!thread.parent) await thread.fetch();
    if (!thread.parent || !forumIds.includes(thread.parent.id)) return;

    // ✅ 포럼 스레드만
    if (thread.type !== ChannelType.PublicThread) return;

    // ✅ 중복 방지
    if (sentThreads.has(thread.id)) return;
    sentThreads.add(thread.id);

    const targetChannel = await client.channels.fetch('1486620867512500254');

    const link = `https://discord.com/channels/${thread.guild.id}/${thread.id}`;

    // 🔥 starter message 가져오기 (재시도 포함)
    const starterMessage = await getStarterMessage(thread);
    const content = starterMessage?.content || '(내용 없음)';

    await targetChannel.send(
      `<@&1010225986748567684>\n${link}\n${content}`
    );

  } catch (err) {
    console.log('에러:', err);
  }
}


// 🚀 스레드 생성 감지 (딜레이 추가)
client.on('threadCreate', async (thread) => {
  setTimeout(async () => {
    await sendAlert(thread);
  }, 1500); // 1.5초 딜레이
});


client.login(process.env.TOKEN);
