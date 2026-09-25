const ARTEFACT_BASE_URL = 'https://www.orcastrate.net/artefacts/shared';
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ARTEFACT_URL_PATTERN = new RegExp(
  `^${ARTEFACT_BASE_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/([0-9a-f-]+)/?$`,
  'i',
);

const resolveArtefactUrl = (input) => {
  if (!input) {
    return null;
  }

  if (UUID_PATTERN.test(input)) {
    return `${ARTEFACT_BASE_URL}/${input}`;
  }

  const match = input.match(ARTEFACT_URL_PATTERN);
  return match ? `${ARTEFACT_BASE_URL}/${match[1]}` : null;
};

export { resolveArtefactUrl };
