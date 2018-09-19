const { Command } = require('discord.js-commando');
const discord = require('discord.js')
const config = require('../../config.json');

module.exports = class ReplyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'addrole',
      group: 'role',
      memberName: 'addrole',
      description: 'Adds a role to the list',
      examples: ['%addrole @catlovers Fun-People']
    });
  }
  async run(msg) {
    if (msg.channel.type !== 'text') return;
    if (!(await isStaff(msg))) return;
    let args = msg.content.substr((msg.client.prefix || msg.client.commandPrefix).length).split(' ');
    args.shift()

    let group = args
    group.shift()
    if (group.length === 0) {
      group = 'Misc';
    } else {
      group = group.join(' ')
    }

    if (!msg.mentions.roles.first()) return msg.channel.send(createError('No role was provided.'))

    let rolename = msg.mentions.roles.first().name
    let roleid = msg.mentions.roles.first().id;
    global.connection.execute('INSERT INTO `roles` (`name`, `roleId`, `group`) VALUES (?, ?, ?)', [rolename, roleid, group], function (err, rows) {
      if (err) return msg.channel.send(createError(err))
      let embed = new discord.RichEmbed()
        .setTitle('Success')
        .setDescription('Role created successfully!')
        .setColor(config.embed.success)
        .addField('Role Name', rolename)
        .addField('Role ID', roleid)
        .addField('Group Name', group)
      return msg.channel.send(embed)
    })
  }

}
function createError(content) {
  let embed = new discord.RichEmbed()
    .setTitle('Error')
    .setDescription(content)
    .setColor(config.embed.error)
  return embed;
}
function successEmbed(content) {
  let embed = new discord.RichEmbed()
    .setTitle('Success')
    .setDescription(content)
    .setColor(config.embed.success)
  return embed;
}
async function isStaff(msg) {
  let role = await msg.member.roles.get(config.staff);
  if (role) {
    return true;
  }
  return false;
}
