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

  var dotFileConfigMock = function() {
    return {
      data: {
        token: 'whatever'
      },
      save: function() {
        // nothing
      }
    };
  };

  var libIndexMock = function(fnName, done) {
    return function() {
      return {
        getChats: function() {
          return Promise.resolve(chats).then(function(chats) {
            done();
            return chats;
          });
        },
        selectChatDialog: function() {
          return Promise.resolve(chats[0]);
        },
        sendMessage: function(chatId) {
          if (fnName === 'sendMessage') {
            done();
          }

          return '0';
        },
        sendFiles: function(chatId) {
          if (fnName === 'sendFiles') {
            done();
          }

          return '0';
        }
      };
    };
  };

  var exec = function(args, fnName, done) {
    for (var i = 0 ; i < args.length ; i++) {
      process.argv[2 + i] = args[i];
    }

    var bins = require('./package.json').bin;
    var keys = Object.keys(bins);

    var lib = proxyquire(bins[keys[0]], {
      './lib/index': libIndexMock(fnName, done),
      'dot-file-config': dotFileConfigMock
    });
  };

	it('should show list of chats', function(done) {
		exec(['--list'], 'getChats', done);
	});

	it('should send message', function(done) {
		exec(['--message="message from bot"'], 'sendMessage', done);
	});

	it('should send files', function(done) {
		exec(['"*.js"'], 'sendFiles', done);
	});

});
