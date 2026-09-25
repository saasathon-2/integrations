# GitHub integration

This Action creates an Klee artefact for a pull request and comments its shared link.

## App setup

Configure the GitHub App with `Issues: Read and write`, `Pull requests: Read-only`, and `Checks: Read-only`, a setup URL of `https://<api-domain>/api/integrations/github/setup`, and a webhook URL of `https://<api-domain>/api/integrations/github/webhook`. Subscribe it to the `Check run` webhook event. The Klee API needs `GITHUB_APP_ID`, `GITHUB_PRIVATE_KEY`, and `GITHUB_WEBHOOK_SECRET`. Each user installs the App from their Klee profile and selects the repositories it may access.

## Workflow

Add this workflow to an installed repository:

```yaml
name: Klee

on:
  pull_request:
    types: [opened, synchronize, reopened]
  # Lets artefact generation run for forked PR updates without requiring a
  # maintainer to approve the pull_request workflow. The action never checks
  # out or executes PR code.
  pull_request_target:
    types: [opened, synchronize, reopened]

permissions:
  id-token: write

jobs:
  generate-artefact:
    if: github.event_name == 'pull_request' || (github.event_name == 'pull_request_target' && github.event.pull_request.head.repo.fork)
    runs-on: ubuntu-latest
    steps:
      - uses: saasathon-2/integrations/github@main
        with:
          api-url: https://<api-domain>
          pull-request: ${{ github.event.pull_request.number }}
```

`api-url` is the public API origin, without a trailing slash. The Action uses GitHub's short-lived OIDC token, so users do not add a Klee secret to their repositories.
