require('http').createServer((req, res) => {
  res.end('ok');
}).listen(process.env.PORT || 3000);

const { Client } = require('discord.js');

const client = new Client({ intents: [] });

console.log('파일 실행됨');

client.once('ready', () => {
  console.log('READY SUCCESS');
});

console.log('로그인 시도');

client.login(process.env.TOKEN)
  .then(() => console.log("LOGIN OK"))
  .catch(err => console.log("LOGIN ERROR:", err));
