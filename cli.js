#!/usr/bin/env node

var config = require('dot-file-config')('.telegram-bot-cli');
var inquirer = require('inquirer-bluebird');

var argv = require('minimist')(process.argv.slice(2));

var run = function(token) {
  if (argv['_'].length === 0) {
    console.log('File path or mask is required');
    process.exit(1);
  } else {
		var r = null;

    if (argv['_'].length === 1) {
      var mask = argv['_'][0];

      r = require('./lib/index')(config, token).selectChatDialog(mask);
    } else {
      var chatId = argv['_'][0];
      var mask = argv['_'][1];

      r = require('./lib/index')(config, token).sendFiles(chatId, mask);
    }

		r.catch(function(err) {
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
