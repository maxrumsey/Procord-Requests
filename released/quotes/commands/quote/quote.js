const { Command } = require('discord.js-commando');
const discord = require('discord.js')
const config = require('../../config.json');

module.exports = class ReplyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'quote',
      group: 'quote',
      memberName: 'quote',
      description: 'Replies with a quote.',
      examples: ['%quote']
    });
  }
  async run(msg) {
    if (msg.channel.type !== 'text') return;
    let args = msg.content.substr((msg.client.prefix || msg.client.commandPrefix).length).split(' ');
    args.shift()
    if (args.length === 0) {
      connection.execute('SELECT * FROM `quotes` ORDER BY RAND() LIMIT 1;', [], function(err, rows, fields) {
        if (err) { return console.log(err); }
        let embed = new discord.RichEmbed()
          .setTitle('Quote: ' + rows[0].id)
          .setDescription(rows[0].content)
          .setFooter(`Type \`${(msg.client.prefix || msg.client.commandPrefix)}quote help\` to view help menu.`)
        return msg.channel.send(embed)
      })
    } else if (args[0] == 'add') {
      if (!(await isStaff(msg))) { return; }
      let initial = args[1];
      let quoteContent = args
      quoteContent.shift()
      if (initial) {
        let possMessage;
        try {
          possMessage = await msg.channel.fetchMessage(initial)
        } catch (e) {
          possMessage = undefined;
        }
        if (possMessage) {
          global.connection.execute(
            "INSERT INTO `quotes` (`content`) VALUES (?)",
            [possMessage.content],
            function(rows, fields, err) {
              if (err) { return console.log(err); }
              msg.channel.send(createAddEmbed(fields.insertId, possMessage.content, 'Message ID'));
            }
          )
        } else {
          global.connection.execute(
            "INSERT INTO `quotes` (`content`) VALUES (?)",
            [quoteContent.join(' ')],
            function(rows, fields, err) {
              if (err) { return console.log(err); }
              msg.channel.send(createAddEmbed(fields.insertId, quoteContent.join(' '), 'Plain Message'));
            }
          )
        }
      } else {
        msg.reply('Invalid Request.')
      }
    } else if (args[0] === 'delete') {
      if (!(await isStaff(msg))) { return; }
      if (!args[1]) {return msg.channel.send(createError('Incorrect usage.'))}
      global.connection.execute(
        "DELETE FROM `quotes` WHERE `id`=?",
        [args[1]],
        function(err, rows, fields) {
          if (err) { return console.log(err); }
          if (rows.affectedRows == 1) {
            msg.channel.send(createDeleteEmbed(args[1]))
          } else {
            msg.channel.send(createError('That ID is non-existent.'))
          }
        }
      )
    } else if (args[0] === 'list') {
      global.connection.execute(
        "SELECT `id` FROM `quotes`",
        [],
        function(err, rows, fields) {
          if (err) { return console.log(err); }
          let count = []
          for (var i = 0; i < rows.length; i++) {
            count.push(rows[i].id);
          }
          msg.channel.send(`Type \`${(msg.client.prefix || msg.client.commandPrefix)}quote [id]\` to view specific quote.\n` + '```\n' + count.join('\n') + '\n```')
        }
      )
    } else if (args[0] == 'help') {
      let embed = new discord.RichEmbed()
        .setTitle('Help Menu')
        .addField(`${(msg.client.prefix || msg.client.commandPrefix)}quote`, 'Views a random quote.')
        .addField(`${(msg.client.prefix || msg.client.commandPrefix)}quote [id]`, 'Views said quote.')
        .addField(`${(msg.client.prefix || msg.client.commandPrefix)}quote add [message ID or quote]`, 'Adds a quote by Message ID or message contents.')
        .addField(`${(msg.client.prefix || msg.client.commandPrefix)}quote delete [id]`, 'Deletes said quote.')
        .addField(`${(msg.client.prefix || msg.client.commandPrefix)}quote list`, 'Lists all quotes')
        .setFooter(`Type \`${(msg.client.prefix || msg.client.commandPrefix)}quote help\` to view help menu.`)
      return msg.channel.send(embed)
    } else {
      connection.execute('SELECT * FROM `quotes` WHERE `id`=?', [args[0]], function(err, rows, fields) {
        if (err) { return console.log(err); }
        let embed = new discord.RichEmbed()
          .setTitle('Quote: ' + rows[0].id)
          .setDescription(rows[0].content)
          .setFooter(`Type \`${(msg.client.prefix || msg.client.commandPrefix)}quote help\` to view help menu.`)
        return msg.channel.send(embed)
      })
    }
  }

}

function createAddEmbed(id, content, how) {
  let embed = new discord.RichEmbed()
    .setTitle('Quote Added')
    .addField('Content', content)
    .addField('ID', id, true)
    .addField('via', how, true)
  return embed;
}

function createDeleteEmbed(id) {
  let embed = new discord.RichEmbed()
    .setTitle('Quote Deleted')
    .addField('ID', id)
  return embed;
}

async function isStaff(msg) {
  let role = await msg.member.roles.get(config.staff);
  if (role) {
    return true;
  }
  return false;
}

function createError(content) {
  let embed = new discord.RichEmbed()
    .setTitle('Error')
    .setDescription(content)
    .setColor(config.embed.error)
  return embed;
}
