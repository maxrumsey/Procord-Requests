const prefix = '!';

const Discord = require('discord.js');
var Client = new Discord.Client();

Client.on('ready', () => {
  console.log(`Logged in as ${Client.user.tag}!`);
});

Client.on('message', async (msg) => {
  if (msg.author.bot || (msg.channel.type === 'dm') || !msg.content.startsWith(prefix)) {
    return;
  }
  let args = msg.content.split(' ');
  const guild = msg.guild.id;
  args.shift();
  await msg.guild.fetchMembers();

  if (msg.content === prefix + 'ping') {
    msg.channel.send({ embed: constructEmbed('Ping', 'Pong!') });
  }
  if (msg.content === prefix + 'mass-assign') {
    const userList = require('./users').users;
    msg.channel.send({ embed: constructEmbed('Begin', `Beginning roling of ${userList.length} users!`, '#7289DA') });
    var actionCount = 0;

    for (var i = 0; i < userList.length; i++) {
      let user;
      if (userList[i].username) {
        user = await guild.members.find(val => val.user.tag === userList[i].username);
      } else if (userList[i].id) {
        user = await guild.members.get(userList[i].id);
      }
      if (!user) {
        await msg.channel.send({ embed: constructEmbed('User Not In Server', `User \`${(userList[i].id||userList[i].username)}\` does not exist in this server. Either they have left the server or the username or the UserID specified in \`users.json\` is incorrect.`, 'RED') });
        continue;
      }
      try {
        user.addRole(userList[i].roleID);
        actionCount++;
      } catch (e) {
        console.error(e);
        await msg.channel.send({ embed: constructEmbed('Error', e, 'RED') });
      }
    }
    await msg.channel.send({ embed: constructEmbed('Success', `Successfully roled ${actionCount} user(s)!`, 'GREEN') });
  }
  if (msg.content.startsWith(prefix + 'mass-move')) {
    if (args.length !== 2) {
      return msg.channel.send({ embed: constructEmbed('Incorrect Syntax', 'Refer to the bot documentation for more info.', 'RED') });
    }
    const members = guild.members;
    msg.channel.send({ embed: constructEmbed('Begin', 'Beginning voice channel assignment of users!', '#7289DA') });
    let actionCount = 0;
    
    for (var member of members) {
      if (member[1].roles.get(args[0])) {
        try {
          if (!member[1].voiceChannel) {
            continue;
          }
          await member[1].setVoiceChannel(args[1]);
          actionCount++;
        } catch (e) {
          await msg.channel.send({ embed: constructEmbed('Error', e, 'RED') });
        }
      }
    }
    await msg.channel.send({ embed: constructEmbed('Success', `Successfully moved ${actionCount} users(s)!`, 'GREEN') });
  }

});

Client.login('YOURTOKENGOESHERE');

function constructEmbed(title, text, color) {
  let embed = new Discord.RichEmbed()
    .setTitle(title)
    .setDescription(text)
    .setTimestamp(new Date())
    .setColor(color)
    .setFooter(Client.user.username);
  return embed;
}
