# Klee integrations

Apps that bring [Klee](https://github.com/saasathon-2/app) artefacts into the tools teams already use. Each folder is independent, with its own setup.

| Folder | What it does |
| --- | --- |
| [`github/`](github) | A GitHub Action that builds an artefact for each pull request and comments its shared link. The Klee API refreshes it when CI finishes. |
| [`slack/`](slack) | A Slack app that unfurls shared artefact links and adds `/klee <artefact-id-or-url>` to post a preview. |
| [`jira/klee/`](jira/klee) | A Forge app that adds a Klee panel to Jira issues and embeds any artefacts linked from the description or comments. |

## Artefact links

The Slack and Jira apps accept any Klee artefact link: shared (`/artefacts/shared/<id>`, optionally `/full`), short (`/artefacts/<id>`), and private (`?artefact=<id>`), with or without `www.`. The parsing is duplicated in `slack/listeners/commands/artefact-url.js` and `jira/klee/src/artefact-url.js`; keep them in sync.

Only shared artefacts render outside Klee. A private one shows Klee's "not shared" page.

## Using the GitHub Action

```yaml
on: pull_request

permissions:
  id-token: write

jobs:
  klee:
    runs-on: ubuntu-latest
    steps:
      - uses: saasathon-2/integrations/github@main
        with:
          api-url: https://<api-domain>
          pull-request: ${{ github.event.pull_request.number }}
```

The Action authenticates with GitHub's OIDC token, so repositories need no Klee secret. See [`github/README.md`](github/README.md) for GitHub App setup and forked pull requests.
