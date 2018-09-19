const { Command } = require('discord.js-commando');
const discord = require('discord.js')
const config = require('../../config.json');

module.exports = class ReplyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'role',
      group: 'role',
      memberName: 'role',
      description: 'Roles a user.',
      examples: ['%role cat-lover']
    });
  }
  async run(msg) {
    if (msg.channel.type !== 'text') return;
    let args = msg.content.substr((msg.client.prefix || msg.client.commandPrefix).length).split(' ');
    args.shift()

    if (args.length === 0) return msg.channel.send(createError('Incorrect Usage.'));


    global.connection.execute('SELECT * FROM `roles` WHERE `name`=?', [args.join(' ')], async function(err, results) {
      if (err) return console.log(err);
      if (results.length === 0) return msg.channel.send(createError('A role by that name does not exist.'));
      if (await msg.member.roles.get(results[0].roleId)) {
        msg.member.removeRole(results[0].roleId);
        return msg.channel.send(successEmbed('Successfully removed role.'))
      }
      try {
        msg.member.addRole(results[0].roleId);
        msg.channel.send(successEmbed('Successfully applied role.'))
      } catch (e) {
        console.log(e);
        return msg.channel.send(createError('Error applying role.'));
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
