import assert from 'node:assert';
import { beforeEach, describe, it, mock } from 'node:test';
import { artefactLinkSharedCallback } from '../../listeners/events/artefact-link-shared.js';

describe('artefact link shared event', () => {
  let fakeClient;
  let fakeLogger;

  beforeEach(() => {
    fakeClient = { chat: { unfurl: mock.fn() } };
    fakeLogger = { error: mock.fn() };
  });

  it('unfurls a shared artefact link with the preview blocks', async () => {
    const sharedUrl = 'https://klee.work/artefacts/shared/4868e69f-ff8c-4d64-922f-363f39357fe9';

    await artefactLinkSharedCallback({
      event: {
        channel: 'C123',
        message_ts: '1234.5678',
        links: [{ url: sharedUrl, domain: 'klee.work' }],
      },
      client: fakeClient,
      logger: fakeLogger,
    });

    assert.strictEqual(fakeClient.chat.unfurl.mock.callCount(), 1);
    const callArgs = fakeClient.chat.unfurl.mock.calls[0].arguments[0];
    assert.strictEqual(callArgs.channel, 'C123');
    assert.strictEqual(callArgs.ts, '1234.5678');
    assert(callArgs.unfurls[sharedUrl].blocks.some((block) => block.type === 'image'));
  });

  it('unfurls a non-shared-format artefact link the same way', async () => {
    const nonSharedUrl = 'https://klee.work/?artefact=4868e69f-ff8c-4d64-922f-363f39357fe9';

    await artefactLinkSharedCallback({
      event: {
        channel: 'C123',
        message_ts: '1234.5678',
        links: [{ url: nonSharedUrl, domain: 'klee.work' }],
      },
      client: fakeClient,
      logger: fakeLogger,
    });

    assert.strictEqual(fakeClient.chat.unfurl.mock.callCount(), 1);
    const callArgs = fakeClient.chat.unfurl.mock.calls[0].arguments[0];
    assert(callArgs.unfurls[nonSharedUrl].blocks.some((block) => block.type === 'image'));
  });

  it('does nothing when no link matches an artefact', async () => {
    await artefactLinkSharedCallback({
      event: {
        channel: 'C123',
        message_ts: '1234.5678',
        links: [{ url: 'https://klee.work/other-page', domain: 'klee.work' }],
      },
      client: fakeClient,
      logger: fakeLogger,
    });

    assert.strictEqual(fakeClient.chat.unfurl.mock.callCount(), 0);
  });

  it('logs error when unfurl throws', async () => {
    const testError = new Error('test exception');
    fakeClient.chat.unfurl = mock.fn(() => {
      throw testError;
    });

    await artefactLinkSharedCallback({
      event: {
        channel: 'C123',
        message_ts: '1234.5678',
        links: [
          { url: 'https://klee.work/artefacts/shared/4868e69f-ff8c-4d64-922f-363f39357fe9' },
        ],
      },
      client: fakeClient,
      logger: fakeLogger,
    });

    assert.deepEqual(fakeLogger.error.mock.calls[0].arguments, [testError]);
  });
});
