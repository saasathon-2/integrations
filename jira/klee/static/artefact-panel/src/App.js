import React, { useEffect, useState } from 'react';
import { events, invoke } from '@forge/bridge';

// Tall enough to show a meaningful slice of an artefact without swallowing
// the rest of the issue; the artefact scrolls inside its frame.
const FRAME_HEIGHT = 600;

const styles = {
  frame: {
    display: 'block',
    width: '100%',
    height: FRAME_HEIGHT,
    border: '1px solid #DFE1E6',
    borderRadius: 3,
    marginBottom: 16,
  },
  message: { color: '#626F86' },
};

// A single embedded artefact.
function Artefact({ url }) {
  return (
    <iframe title="Klee artefact" src={url} style={styles.frame} allow="clipboard-write; fullscreen" />
  );
}

function App() {
  const [urls, setUrls] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadArtefacts = () =>
      invoke('getArtefactUrls')
        .then((result) => {
          setUrls(result);
          setError(false);
        })
        .catch((err) => {
          console.error('Failed to load Klee artefacts', err);
          setError(true);
        });

    loadArtefacts();

    // Re-scan when the issue is edited (e.g. a link is pasted into the
    // description or a comment is added) so new artefacts show up live.
    const subscription = events.on('JIRA_ISSUE_CHANGED', loadArtefacts);

    return () => {
      subscription.then((sub) => sub.unsubscribe());
    };
  }, []);

  if (error) {
    return <p style={styles.message}>Couldn't load Klee artefacts for this issue.</p>;
  }

  if (!urls) {
    return <p style={styles.message}>Loading…</p>;
  }

  if (urls.length === 0) {
    return <p style={styles.message}>Paste a klee.work artefact link into the description or a comment to embed it here.</p>;
  }

  return (
    <div>
      {urls.map((url) => (
        <Artefact key={url} url={url} />
      ))}
    </div>
  );
}

export default App;
