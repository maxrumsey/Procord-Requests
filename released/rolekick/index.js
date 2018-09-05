const token = 'SUPER SECRET TOKEN';
const roleInfo = {
  id: '476657666295332885'
}

const discord = require('discord.js')
const moment = require('moment');
let client = new discord.Client();
let queue = require('./queue.json').queue

client.on('guildMemberUpdate', async (oldRole, newRole) => {
  let oldRoles = await oldRole.roles.get(roleInfo.id);
  let newRoles = await newRole.roles.get(roleInfo.id);
  if (!oldRoles && newRoles) {
    queue.push({date: new Date(), user: newRole.id})
    writePoints();
  }
})

client.on('ready', () => {
  console.log('Bot is ready.')
})

/*
client.on('message', (msg) => {
  if (msg.content === '!maneval') {
    evalBans();
  }
  if (msg.content === '!writefile') {
    writeFile();
  }
})
*/

client.login(token)

async function evalBans() {
  if (queue.length === 0) {
    return;
  }
  for (var i = 0; i < queue.length; i++) {
    let date = moment(queue[i].date).add(1, 'm').toDate();
    if (date <= new Date()) {
      let mem = await client.guilds.first().fetchMember(queue[i].user);
      mem.kick();
      queue.splice(i, 1)
    }
  }
  writePoints()
}

function writePoints() {
  const arr = {
    queue: queue,
  }
  require('fs').writeFile("./queue.json", JSON.stringify(arr), (err) => {
    if (err) console.error(err)
  });
}

setInterval(async function() {await evalBans()}, 5000)
