#!/usr/bin/env node

var config = require('dot-file-config')('.telegram-bot-cli');
var inquirer = require('inquirer-bluebird');

var argv = require('minimist')(process.argv.slice(2));
var run = function(token) {
  var lib = require('./lib/index')(config, token);

  if (argv['list']) {
    return lib.getChats().then(function(chats) {
      chats.forEach(function(chat) {
        console.log((chat.title || chat.first_name + ' ' + chat.last_name) + ' (id: ' + chat.id + ')');
      });
    });
  } else if (argv['_'].length === 0 && !argv['message']) {
    console.log('File path or mask is required');
    process.exit(1);
  } else {
    var r = null;

    (function() {
      if (argv['message']) {
        var chatId = argv['chat_id'];

        if (argv['chat_id']) {
          return lib.sendMessage(chatId, argv['message']);
        } else {
          return lib.selectChatDialog().then(function(chatId) {
            return lib.sendMessage(chatId, argv['message']);
          });
        }
      } else {
        var mask = argv['_'][0];

        if (argv['chat_id']) {
          return lib.sendFiles(argv['chat_id'], mask);
        } else {
          return lib.selectChatDialog().then(function(chatId) {
            return lib.sendFiles(chatId, mask);
          });
        }
      }
    })().then(function(ids) {
      console.log('success (ids: ' + ids + ')');
    }).catch(function(err) {
  		console.log(err.message || err.description);
      process.exit(1);
    });
  }

};

if (argv['token']) {
  run(argv['token']);
} else if (config.data.token) {
  run(config.data.token);
} else {
  inquirer.prompt({
    type: 'input',
    name: 'token',
    message: 'Insert token'
  }).then(function(answers) {
    config.data.token = answers.token;
    config.save();

    run(config.data.token);
  });
}
