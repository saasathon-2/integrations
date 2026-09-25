import { renderPageBlocks } from '../commands/render-page-blocks.js';
import { resolveArtefactUrl } from '../commands/artefact-url.js';

const artefactLinkSharedCallback = async ({ event, client, logger }) => {
  try {
    const unfurls = {};

    for (const link of event.links) {
      const resolvedUrl = resolveArtefactUrl(link.url);
      if (resolvedUrl) {
        unfurls[link.url] = { blocks: renderPageBlocks(resolvedUrl, 'Artefact preview') };
      }
    }

    if (Object.keys(unfurls).length === 0) {
      return;
    }

    await client.chat.unfurl({
      channel: event.channel,
      ts: event.message_ts,
      unfurls,
    });
  } catch (error) {
    logger.error(error);
  }
};

export { artefactLinkSharedCallback };
