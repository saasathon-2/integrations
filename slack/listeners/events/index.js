import { appHomeOpenedCallback } from './app-home-opened.js';
import { artefactLinkSharedCallback } from './artefact-link-shared.js';

export const register = (app) => {
  app.event('app_home_opened', appHomeOpenedCallback);
  app.event('link_shared', artefactLinkSharedCallback);
};
