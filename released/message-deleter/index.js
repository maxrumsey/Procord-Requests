const discord = require('discord.js');
const client = new discord.Client();
const token = 'yourtoken';

client.on('guildMemberRemove', async function(member) {
  try {
    await member.ban({
      days: 7,
      reason: 'Automatic Softban to Remove Messages'
    });
    await member.guild.unban(member, 'Automatic Softban to Remove Messages');
  } catch (e) {
    console.log(e);
  }
})

client.login(token);
