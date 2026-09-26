# Slack integration

A [Bolt for JavaScript](https://docs.slack.dev/tools/bolt-js/) app that previews Klee artefacts in Slack.

- Pasting a shared artefact link (on `klee.work`) unfurls it into a preview.
- `/klee <artefact-id-or-url>` posts a preview in the channel.

Link parsing lives in `listeners/commands/artefact-url.js`, shared with the Jira app's copy; keep the two in sync.

## Setup

1. Create a Slack app from `manifest.json` at [api.slack.com/apps](https://api.slack.com/apps), or with the Slack CLI.
2. Copy `.env.sample` to `.env` and fill in the tokens. `app.js` runs in Socket Mode and needs `SLACK_BOT_TOKEN` and `SLACK_APP_TOKEN`. `app-oauth.js` serves over HTTP for multi-workspace installs and needs `SLACK_CLIENT_ID`, `SLACK_CLIENT_SECRET`, and `SLACK_SIGNING_SECRET`.
3. Install dependencies and start the app.

```sh
npm install
npm start      # or: slack run
```

## Development

```sh
npm run dev    # restart on change
npm test
npm run lint
```

`listeners/` holds one folder per Slack surface (commands, events, actions, and so on). The `sample-*` listeners are left over from the Bolt template.
