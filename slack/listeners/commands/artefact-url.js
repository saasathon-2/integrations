const ARTEFACT_HOST = 'klee.work';
const ARTEFACT_BASE_URL = `https://${ARTEFACT_HOST}/artefacts/shared`;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const buildArtefactUrl = (id) => `${ARTEFACT_BASE_URL}/${id}`;

// The id is unified across the private (?artefact=<id>) and shared
// (/artefacts/shared/<id>) urls, so any form resolves to the same id.
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

  if (parsed.hostname !== ARTEFACT_HOST) {
    return null;
  }

  const segments = parsed.pathname.split('/').filter(Boolean);
  const sharedId = segments.length >= 3 && segments[0] === 'artefacts' && segments[1] === 'shared'
    ? segments[2]
    : null;
  const queryId = parsed.searchParams.get('artefact');
  const id = sharedId ?? queryId;

  return id && UUID_PATTERN.test(id) ? id : null;
};

const resolveArtefactUrl = (input) => {
  const id = resolveArtefactId(input);
  return id ? buildArtefactUrl(id) : null;
};

export { resolveArtefactUrl, ARTEFACT_HOST };
