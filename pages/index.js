import React from 'react';
import NoSSR from 'react-no-ssr';
import OfflineRuntime from '../components/OfflineRuntime';

export default () => (
  <main>
    <section>
      <h1>
        This section is server-side rendered.
      </h1>
    </section>

    <NoSSR>
      <OfflineRuntime />
    </NoSSR>
  </main>
);
