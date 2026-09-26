// Mirrors slack/listeners/commands/artefact-url.js so every integration
// recognises the same Klee links. Keep the two in sync.
const ARTEFACT_HOST = 'klee.work';
// Links copied from either address should resolve; embeds always use the bare domain.
const ARTEFACT_HOSTS = new Set([ARTEFACT_HOST, `www.${ARTEFACT_HOST}`]);
const ARTEFACT_BASE_URL = `https://${ARTEFACT_HOST}/artefacts/shared`;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Matches anything that looks like a Klee url inside free text. It stops at
// whitespace and at characters that commonly wrap links in Jira content
// (quotes from the serialised ADF JSON, brackets and pipes from wiki markup).
const ARTEFACT_LINK_PATTERN = /https?:\/\/(?:www\.)?klee\.work\/[^\s"'<>()[\]|\\]+/gi;

const buildArtefactUrl = (id) => `${ARTEFACT_BASE_URL}/${id}`;

// The id is unified across the private (?artefact=<id>), shared
// (/artefacts/shared/<id>, optionally /full) and short (/artefacts/<id>)
// urls, so any form resolves to the same id.
// Whether it's actually viewable is decided by the app itself (the shared
// page shows a "not shared" message if the artefact hasn't been shared).
const resolveArtefactId = (input) => {
  if (!input) {
    return null;
  }

  if (UUID_PATTERN.test(input)) {
    return input;
  }

  let parsed;
  try {
    parsed = new URL(input);
  } catch {
    return null;
  }

  if (!ARTEFACT_HOSTS.has(parsed.hostname)) {
    return null;
  }

  const segments = parsed.pathname.split('/').filter(Boolean);
  const sharedId = segments[0] !== 'artefacts' ? null : segments[1] === 'shared' ? segments[2] : segments[1];
  const queryId = parsed.searchParams.get('artefact');
  const id = sharedId ?? queryId;

  return id && UUID_PATTERN.test(id) ? id : null;
};

const resolveArtefactUrl = (input) => {
  const id = resolveArtefactId(input);
  return id ? buildArtefactUrl(id) : null;
};

// Finds every distinct Klee artefact referenced in a blob of text, in the
// order they first appear. The same artefact linked several times (or via
// different url forms) is only returned once.
const findArtefactUrls = (text) => {
  const urls = new Set();

  for (const match of text.matchAll(ARTEFACT_LINK_PATTERN)) {
    // In the serialised ADF JSON a url may contain an escaped "&" (&),
    // so decode that, and drop sentence punctuation typed straight after a link.
    const candidate = match[0].replace(/\\u0026/g, '&').replace(/[.,;:!?]+$/, '');
    const resolved = resolveArtefactUrl(candidate);
    if (resolved) {
      urls.add(resolved);
    }
  }

  return [...urls];
};

export { findArtefactUrls, resolveArtefactUrl, ARTEFACT_HOST };
