import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';
import { findArtefactUrls } from './artefact-url.js';

const resolver = new Resolver();

// Returns the shared urls of every Klee artefact linked from the current issue.
//
// Links can live in the description or in any comment. Rather than walk the
// Atlassian Document Format tree (links can be plain text, link marks, inline
// cards or block cards), we serialise the fields to JSON and scan the string:
// every one of those shapes ends up as a plain url somewhere in the JSON.
resolver.define('getArtefactUrls', async (req) => {
  const key = req.context.extension.issue.key;

  // asUser() means Jira enforces the viewer's own permissions on the issue.
  const res = await api.asUser().requestJira(route`/rest/api/3/issue/${key}?fields=description,comment`);

  if (!res.ok) {
    console.error(`${key}: Failed to load issue (${res.status})`);
    throw new Error(`Could not load issue ${key}`);
  }

  const { fields } = await res.json();
  // Jira returns at most the first page of comments here, which covers the
  // typical issue. The description is scanned first so its links come first.
  const content = [fields.description, ...(fields.comment?.comments ?? []).map((comment) => comment.body)];

  return findArtefactUrls(JSON.stringify(content));
});

export const handler = resolver.getDefinitions();
