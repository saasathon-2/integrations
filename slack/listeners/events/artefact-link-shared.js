import { renderPageBlocks } from '../commands/render-page-blocks.js';
import { resolveArtefactUrl } from '../commands/artefact-url.js';

const artefactLinkSharedCallback = async ({ event, client, logger }) => {
  try {
    const unfurls = {};

    for (const link of event.links) {
      const resolvedUrl = resolveArtefactUrl(link.url);
      if (resolvedUrl) {
        unfurls[link.url] = {
          blocks: renderPageBlocks(resolvedUrl, 'Artefact preview'),
        };
      }
    }

    const urls = event.links.map((link) => link.url);
    logger.info(`link_shared: ${Object.keys(unfurls).length} of ${urls.length} links are Klee artefacts`, urls);
    if (Object.keys(unfurls).length === 0) {
      return;
    }

    await client.chat.unfurl({
      channel: event.channel,
      ts: event.message_ts,
      unfurls,
    });
  } catch (error) {
    // Slack's reason (e.g. missing_scope, cannot_unfurl_url) lives on error.data.
    logger.error('Could not unfurl Klee link', error.data ?? error);
  }
};

export { artefactLinkSharedCallback };
