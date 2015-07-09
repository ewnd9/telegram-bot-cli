var Promise = require('bluebird');
var Telegram = require('telegram-bot-api');
var path = require('path');

var _ = require('lodash');

module.exports = function(token) {
  var client = Promise.promisifyAll(new Telegram({token:token}));
  var api = {
    client: client,
    getChats: function() {
      return client.getUpdatesAsync({limit: 100}).then(function(data) {
        var chatsList = _.map(data, function(item) {
          return item.message.chat;
        });

        var chats = _.uniq(chatsList, function(chat) {
          return chat.id;
        })

        return chats;
      });
    },
    sendDocument: function(chatId, doc) {
      return client.sendDocumentAsync({
        chat_id: chatId,
        document: doc
      });
    },
    sendPhoto: function(chatId, photo, caption) {
      return client.sendPhotoAsync({
        chat_id: chatId,
  	    caption: caption,
        photo: photo
      });
    },
    sendMessage: function(chatId, message) {
      return client.sendMessageAsync({
        chat_id: chatId,
        disable_web_page_preview: 'true',
        text: message
      });
    }
  }

  api.sendFiles = function(chatId, files, caption) {
    return Promise.reduce(files, function(total, file) {
      return api.sendDocument(chatId, path.resolve(file)).then(function(res) {
        total.push(res);
        return total;
      });
    }, []).then(function(total) {
      var info = _.map(total, function(item) {
        return item.message_id;
      });

      return info.join(', ');
    });
  }

  return api;
};
