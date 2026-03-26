console.log("start");
const { Client } = require('discord.js');

// 🔥 서버 먼저
require('http').createServer((req, res) => {
  res.end('ok');
}).listen(process.env.PORT || 3000);

const client = new Client({ intents: [] });

console.log("시작됨");

client.once('ready', () => {
  console.log('READY SUCCESS');
});

client.login(process.env.TOKEN)
  .then(() => console.log("LOGIN OK"))
  .catch(err => console.log("LOGIN ERROR:", err));

// 🔥 프로세스 죽지 않게 유지
setInterval(() => {}, 1000);
