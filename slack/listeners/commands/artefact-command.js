import { renderPageBlocks } from './render-page-blocks.js';
import { resolveArtefactUrl } from './artefact-url.js';

const artefactCommandCallback = async ({ command, ack, respond, logger }) => {
  try {
    await ack();

    const input = command.text?.trim();

    if (!input) {
      await respond('Usage: `/klee <artefact-id-or-url>`');
      return;
    }

    const url = resolveArtefactUrl(input);

    if (!url) {
      await respond(`"${input}" doesn't look like a valid artefact id or url.`);
      return;
    }

    await respond({
      response_type: 'in_channel',
      text: url,
      blocks: renderPageBlocks(url, 'Artefact preview'),
    });
  } catch (error) {
    logger.error(error);
  }
};

export { artefactCommandCallback };
