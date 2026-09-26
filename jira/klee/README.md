# Jira integration

A Forge app that adds a **Klee** issue panel to Jira. The panel scans the issue's description and comments for Klee artefact links (`https://klee.work/...`) and embeds each linked artefact below the description.

Any link form works: shared (`/artefacts/shared/<id>`, optionally `/full`), short (`/artefacts/<id>`) and private (`?artefact=<id>`), with or without `www.`. The same parsing lives in `slack/listeners/commands/artefact-url.js`, so keep the two in sync. An artefact only renders if it has been shared in Klee. Otherwise the embed shows Klee's "not shared" page.

The panel refreshes when the issue changes, so a newly pasted link appears without reloading the page.

## Adding the panel to an issue

Forge can't open an issue panel automatically ([FRGE-734](https://community.developer.atlassian.com/t/display-forge-app-automatically-when-opening-issue-panel/86121)). On each issue, click the **Apps** button under the summary and choose **Klee**. After that the panel stays on the issue and picks up every Klee link on it.

## Development

See [Set up Forge](https://developer.atlassian.com/platform/forge/set-up-forge/) to install the Forge CLI.

```sh
npm install
cd static/artefact-panel && npm install && npm run build && cd -
forge lint
forge deploy --non-interactive -e development
forge install --non-interactive --site <site>.atlassian.net --product jira --environment development
```

`manifest.yml` adds `https://klee.work` to `permissions.external.frames` so the iframe is allowed. Changing permissions means redeploying and then running `forge install --upgrade`.
