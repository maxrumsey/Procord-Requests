const { Command } = require('discord.js-commando');
const discord = require('discord.js')
const config = require('../../config.json');

module.exports = class ReplyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'roles',
      group: 'role',
      memberName: 'roles',
      description: 'Lists all roles.',
      examples: ['%roles', '%roles Animal Lovers']
    });
  }
  async run(msg) {
    if (msg.channel.type !== 'text') return;
    let args = msg.content.substr((msg.client.prefix || msg.client.commandPrefix).length).split(' ');
    args.shift()

    global.connection.execute('SELECT * FROM `roles`', [], async function(err, roles) {
      if (err) return console.log(err);
      let groups = [];

      for (var i = 0; i < roles.length; i++) {
        if (!groups.includes(roles[i].group)) groups.push(roles[i].group)
      }
      if (args.length === 0) {
        let prefix = (msg.client.prefix || msg.client.commandPrefix);
        return msg.channel.send('**Categories**\nType `' + prefix + 'role <name>` to give yourself this role!\nType `' + prefix + 'roles [category]` to view roles in category.\n```' + groups.join('\n') + '```')
      } else {
        let prefix = (msg.client.prefix || msg.client.commandPrefix);
        let group = args.join(' ');
        let rolesInGroup = [];
        for (var i = 0; i < roles.length; i++) {
          if (roles[i].group === group) rolesInGroup.push(roles[i].name);
        }
        if (rolesInGroup.length === 0) {
          return msg.channel.send(createError('No roles were found in this category.'))
        }
        return msg.channel.send('**Categories**\nType `' + prefix + 'role <name>` to give yourself this role!\n```' + rolesInGroup.join('\n') + '\n```')
      }
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
