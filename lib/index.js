module.exports = function(config, token) {

  var Promise = require('bluebird');
  var telegram = require('./telegram')(token);
  var _ = require('lodash');

  var getFiles = function(mask) {
    // var os = require('os');
    // var username = Promise.promisify(require('username'));
    var globAsync = Promise.promisify(require('glob'));

    return Promise.props({
      files: globAsync(mask, {}),
      // username: username()
    }).then(function(result) {
      // result.username = result.username + '@' + os.hostname();
      console.log('sending ' + result.files.length + ' files [' + result.files.join(', ') + ']');

      return result;
    });
  };

  var sendFilesTg = function(chatId, files, username) {
    return telegram.sendFiles(chatId, files, username);
  };

  var sendFiles = function(chatId, mask) {
    return getFiles(mask).then(function(result) {
      return sendFilesTg(chatId, result.files, result.username);
    });
  };

  var selectChatDialog = function(mask) {
    var inquirer = require('inquirer-bluebird');
    var chats = config.data.chats || [];

    var showDialog = function() {
      return inquirer.prompt({
        type: 'list',
        name: 'chat',
        message: 'Select chat',
        choices: _.map(chats, function(chat) {
          return {
            name: (chat.title || chat.first_name + ' ' + chat.last_name) + ' (id: ' + chat.id + ')',
            value: chat
          };
        }).concat(new inquirer.Separator(), 'refetch chats')
      }).then(function(answers) {
        if (answers.chat === 'refetch chats') {
          return refetch();
        } else {
          return answers.chat.id;
        }
      });
    };

    var refetch = function() {
      return telegram.getChats().then(function(_chats) {
        config.data.chats = chats;
        config.save();

        chats = _chats;

        return showDialog();
      });
    };

    if (chats.length === 0) {
      return refetch();
    } else {
      return showDialog();
    }
  };

  return {
    selectChatDialog: selectChatDialog,
    sendFiles: sendFiles,
    sendMessage: telegram.sendMessage
  };
};
