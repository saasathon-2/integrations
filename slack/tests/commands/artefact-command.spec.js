import assert from 'node:assert';
import { beforeEach, describe, it, mock } from 'node:test';
import { artefactCommandCallback } from '../../listeners/commands/artefact-command.js';

describe('artefact command', () => {
  let fakeAck;
  let fakeRespond;
  let fakeLogger;

  beforeEach(() => {
    fakeAck = mock.fn();
    fakeRespond = mock.fn();
    fakeLogger = {
      error: mock.fn(),
    };
  });

  it('renders the artefact url for a valid id', async () => {
    await artefactCommandCallback({
      command: { text: '4868e69f-ff8c-4d64-922f-363f39357fe9' },
      ack: fakeAck,
      respond: fakeRespond,
      logger: fakeLogger,
    });

    assert.strictEqual(fakeAck.mock.callCount(), 1);
    const callArgs = fakeRespond.mock.calls[0].arguments[0];
    assert.strictEqual(
      callArgs.text,
      'https://klee.work/artefacts/shared/4868e69f-ff8c-4d64-922f-363f39357fe9',
    );

    assert.strictEqual(callArgs.blocks.length, 2);
    assert.strictEqual(callArgs.blocks[0].type, 'image');
    assert.strictEqual(callArgs.blocks[1].type, 'actions');
    assert(
      callArgs.blocks[0].image_url.includes(
        'https://klee.work/artefacts/shared/4868e69f-ff8c-4d64-922f-363f39357fe9',
      ),
    );
    assert.strictEqual(
      callArgs.blocks[1].elements[0].url,
      'https://klee.work/artefacts/shared/4868e69f-ff8c-4d64-922f-363f39357fe9',
    );
  });

  it('renders the artefact url when given the full url', async () => {
    await artefactCommandCallback({
      command: {
        text: 'https://klee.work/artefacts/shared/4868e69f-ff8c-4d64-922f-363f39357fe9',
      },
      ack: fakeAck,
      respond: fakeRespond,
      logger: fakeLogger,
    });

    const callArgs = fakeRespond.mock.calls[0].arguments[0];
    assert.strictEqual(
      callArgs.text,
      'https://klee.work/artefacts/shared/4868e69f-ff8c-4d64-922f-363f39357fe9',
    );
  });

  it('accepts the short and full-screen artefact urls', async () => {
    for (const text of [
      'https://klee.work/artefacts/4868e69f-ff8c-4d64-922f-363f39357fe9',
      'https://klee.work/artefacts/shared/4868e69f-ff8c-4d64-922f-363f39357fe9/full',
    ]) {
      fakeRespond.mock.resetCalls();
      await artefactCommandCallback({ command: { text }, ack: fakeAck, respond: fakeRespond, logger: fakeLogger });
      assert.strictEqual(
        fakeRespond.mock.calls[0].arguments[0].text,
        'https://klee.work/artefacts/shared/4868e69f-ff8c-4d64-922f-363f39357fe9',
      );
    }
  });

  it('accepts links on the www address', async () => {
    await artefactCommandCallback({
      command: {
        text: 'https://www.klee.work/artefacts/shared/4868e69f-ff8c-4d64-922f-363f39357fe9',
      },
      ack: fakeAck,
      respond: fakeRespond,
      logger: fakeLogger,
    });

    const callArgs = fakeRespond.mock.calls[0].arguments[0];
    assert.strictEqual(
      callArgs.text,
      'https://klee.work/artefacts/shared/4868e69f-ff8c-4d64-922f-363f39357fe9',
    );
  });

  it('renders the artefact url when given the non-shared url', async () => {
    await artefactCommandCallback({
      command: {
        text: 'https://klee.work/?artefact=4868e69f-ff8c-4d64-922f-363f39357fe9',
      },
      ack: fakeAck,
      respond: fakeRespond,
      logger: fakeLogger,
    });

    const callArgs = fakeRespond.mock.calls[0].arguments[0];
    assert.strictEqual(
      callArgs.text,
      'https://klee.work/artefacts/shared/4868e69f-ff8c-4d64-922f-363f39357fe9',
    );
  });

  it('prompts for usage when no id is given', async () => {
    await artefactCommandCallback({
      command: { text: '' },
      ack: fakeAck,
      respond: fakeRespond,
      logger: fakeLogger,
    });

    const callArgs = fakeRespond.mock.calls[0].arguments[0];
    assert(callArgs.includes('Usage'));
  });

  it('rejects an invalid artefact id', async () => {
    await artefactCommandCallback({
      command: { text: 'not-an-id' },
      ack: fakeAck,
      respond: fakeRespond,
      logger: fakeLogger,
    });

    const callArgs = fakeRespond.mock.calls[0].arguments[0];
    assert(callArgs.includes("doesn't look like a valid artefact id or url"));
  });

  it('logs error when ack throws exception', async () => {
    const testError = new Error('test exception');
    fakeAck = mock.fn(() => {
      throw testError;
    });

    await artefactCommandCallback({
      command: { text: '' },
      ack: fakeAck,
      respond: fakeRespond,
      logger: fakeLogger,
    });

    assert.deepEqual(fakeLogger.error.mock.calls[0].arguments, [testError]);
  });
});
