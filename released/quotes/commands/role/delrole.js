const { Command } = require('discord.js-commando');
const discord = require('discord.js')
const config = require('../../config.json');

module.exports = class ReplyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'delrole',
      group: 'role',
      memberName: 'delrole',
      description: 'Deletes a role.',
      examples: ['%delrole cat-lover']
    });
  }
  async run(msg) {
    if (msg.channel.type !== 'text') return;
    if (!(await isStaff(msg))) return;

    let args = msg.content.substr((msg.client.prefix || msg.client.commandPrefix).length).split(' ');
    args.shift()

    if (args.length === 0) return msg.channel.send(createError('Incorrect Usage.'));

    global.connection.execute('DELETE FROM `roles` WHERE `name`=?', [args.join(' ')], function(err, res, fields) {
      if (err) return console.log(err);
      if (res.affectedRows === 0) {
        return msg.channel.send(createError('No roles were deleted'))
      }
      return msg.channel.send(successEmbed('The role was deleted.'))
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
async function isStaff(msg) {
  let role = await msg.member.roles.get(config.staff);
  if (role) {
    return true;
  }
  return false;
}
function successEmbed(content) {
  let embed = new discord.RichEmbed()
    .setTitle('Success')
    .setDescription(content)
    .setColor(config.embed.success)
  return embed;
}
