const thumbnailUrl = (url) => {
  // thum.io caches renders by url, which would otherwise keep serving a
  // stale screenshot (e.g. an old "not found"/"not shared" render) even
  // after the underlying page changes. Busting the cache keeps the
  // screenshot in sync with the artefact's current state.
  const cacheBustedUrl = `${url}${url.includes('?') ? '&' : '?'}_cb=${Date.now()}`;
  return `https://image.thum.io/get/width/1200/crop/900/noanimate/${cacheBustedUrl}`;
};

const renderPageBlocks = (url, label) => [
  {
    type: 'image',
    image_url: thumbnailUrl(url),
    alt_text: label,
  },
  {
    type: 'actions',
    elements: [
      {
        type: 'button',
        text: {
          type: 'plain_text',
          text: 'Open in browser',
        },
        url,
        action_id: 'open_page',
      },
    ],
  },
];

export { renderPageBlocks };
