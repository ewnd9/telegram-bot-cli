# telegram-bot-cli

Unofficial telegram bot cli

Work In Progress

## Install

```
$ npm install -g telegram-bot-cli
```

## Usage

```
# send files by mask
$ telegram-bot "<file_mask>" # show dialog with chat selection
$ telegram-bot "<file_mask>" --chat_id=<chat_id>
$ telegram-bot "<file_mask>" --chat_id=<chat_id> --token=<token>

# send message
$ telegram-bot --message="message from bot" --chat_id=<chat_id>
$ telegram-bot --message="message from bot" --chat_id=<chat_id> --token=<token>
```

## Roadmap

- [ ] Load-spinner
- [ ] Tests
