#!/usr/bin/env node

var config = require('dot-file-config')('.telegram-bot-cli');
var inquirer = require('inquirer-bluebird');

var argv = require('minimist')(process.argv.slice(2));
var run = function(token) {
  if (argv['_'].length === 0 && !argv['message']) {
    console.log('File path or mask is required');
    process.exit(1);
  } else {
		var r = null;
    var lib = require('./lib/index')(config, token);

    if (argv['message']) {
      var chatId = argv['chat_id'];

      if (argv['chat_id']) {
        r = lib.sendMessage(chatId, argv['message']);
      } else {
        r = lib.selectChatDialog(mask).then(function(chatId) {
          return lib.sendMessage(chatId, argv['message']);
        });
      }
    } else {
      var mask = argv['_'][0];

      if (argv['chat_id']) {
        r = lib.sendFiles(argv['chat_id'], mask);
      } else {
        r = lib.selectChatDialog(mask).then(function(chatId) {
          return lib.sendFiles(chatId, mask);
        });
      }
    }

		r.then(function(ids) {
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
