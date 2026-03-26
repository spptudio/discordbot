const { Client } = require('discord.js');

// 🔥 이거 꼭 있어야 함 (Render용)
require('http').createServer((req, res) => {
  res.end('ok');
}).listen(process.env.PORT || 3000);

const client = new Client({ intents: [] });

client.once('ready', () => {
  console.log('READY SUCCESS');
});

console.log('로그인 시도');

client.login(process.env.TOKEN)
  .then(() => console.log("LOGIN OK"))
  .catch(err => console.log("LOGIN ERROR:", err));
