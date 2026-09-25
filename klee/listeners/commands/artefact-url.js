const ARTEFACT_HOST = 'www.orcastrate.net';
const ARTEFACT_BASE_URL = `https://${ARTEFACT_HOST}/artefacts/shared`;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const buildArtefactUrl = (id) => `${ARTEFACT_BASE_URL}/${id}`;

const resolveArtefactUrl = (input) => {
  if (!input) {
    return null;
  }

  if (UUID_PATTERN.test(input)) {
    return buildArtefactUrl(input);
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
  const id = segments.length === 3 && segments[0] === 'artefacts' && segments[1] === 'shared'
    ? segments[2]
    : null;

  return id && UUID_PATTERN.test(id) ? buildArtefactUrl(id) : null;
};

export { resolveArtefactUrl, ARTEFACT_HOST };
