# telegram-bot-cli

[![Build Status](https://travis-ci.org/ewnd9/telegram-bot-cli.svg?branch=master)](https://travis-ci.org/ewnd9/telegram-bot-cli)

Unofficial telegram bot cli

:warning: Deprecation notice: Use `curl` and aliases instead

```sh
alias send-tg="curl \"https://api.telegram.org/bot$TOKEN/sendMessage?chat_id=$CHAT_ID&text=$TEXT\""
```

## Related

- https://core.telegram.org/bots/api - api documentation

## Install

```
$ npm install -g telegram-bot-cli
```

## Usage

```
# list of joined chats and users
$ telegram-bot --list

# send files by mask
$ telegram-bot "<file_mask>" # show dialog with chat selection
$ telegram-bot "<file_mask>" --chat_id=<chat_id>
$ telegram-bot "<file_mask>" --chat_id=<chat_id> --token=<token>

# send message
$ telegram-bot --message="message from bot"
$ telegram-bot --message="message from bot" --chat_id=<chat_id>
$ telegram-bot --message="message from bot" --chat_id=<chat_id> --token=<token>
```
