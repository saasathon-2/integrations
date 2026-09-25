# GitHub integration

This Action creates an Orcastrate artefact for a pull request and comments its shared link.

## App setup

Configure the GitHub App with `Issues: Read and write`, `Pull requests: Read-only`, and `Checks: Read-only`, a setup URL of `https://<api-domain>/api/integrations/github/setup`, and a webhook URL of `https://<api-domain>/api/integrations/github/webhook`. Subscribe it to the `Check run` webhook event. The Orcastrate API needs `GITHUB_APP_ID`, `GITHUB_PRIVATE_KEY`, and `GITHUB_WEBHOOK_SECRET`. Each user installs the App from their Orcastrate profile and selects the repositories it may access. The workflow below also refreshes the artefact when a PR CI workflow completes, so it remains current if a check-run delivery is missed.

## Workflow

Add this workflow to an installed repository:

```yaml
name: Orcastrate

on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  id-token: write

jobs:
  generate-artefact:
    runs-on: ubuntu-latest
    steps:
      - uses: saasathon-2/integrations/github@main
        with:
          api-url: https://<api-domain>
          pull-request: ${{ github.event.pull_request.number }}
```

`api-url` must exactly match the API's `BETTER_AUTH_URL`, without a trailing slash. The Action uses GitHub's short-lived OIDC token, so users do not add an Orcastrate secret to their repositories.
