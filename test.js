'use strict';

var fs = require('fs');
var expect = require('chai').expect;
var Promise = require('bluebird');
var proxyquire =  require('proxyquire');

describe('telegram-bot-cli', function() {

  var chat = function(id) {
    return {
      title: 'chat ' + id,
      id: id
    }
  };

  var chats = [chat(0), chat(1)];

  var config = require('dot-file-config')('.telegram-bot-cli');
  config.data.token = 'whatever';
  config.save();

  var libIndexMock = function(done) {
    return function() {
      return {
        getChats: function() {
          return new Promise(function(resolve) {
            done();
            resolve(chats);
          });
        },
        selectChatDialog: function() {
          return new Promise(function(resolve) {
            resolve(chats[0]);
          });
        },
        sendMessage: function(chatId) {
          done();
          return '0';
        },
        sendFiles: function(chatId) {
          done();
          return '0';
        }
      };
    };
  };

  var exec = function(args, mocks) {
    for (var i = 0 ; i < args.length ; i++) {
      process.argv[2 + i] = args[i];
    }

    var lib = proxyquire('./cli.js', mocks);
  };

	it('should show list of chats', function(done) {
		exec(['--list'], {
      './lib/index': libIndexMock(done)
    });
	});

	it('should send message', function(done) {
		exec(['--message="message from bot"'], {
      './lib/index': libIndexMock(done)
    });
	});

	it('should send files', function(done) {
		exec(['"*.js"'], {
      './lib/index': libIndexMock(done)
    });
	});

});
