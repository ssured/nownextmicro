import React from 'react';

let didInstall = false;

export default () => {
  if (!didInstall) {
    const OfflinePlugin = require('offline-plugin/runtime');
    OfflinePlugin.install({
      onInstalled: function() {
        console.log('installed manifest');
      },
      onUpdating: function() {
        console.log('updated manifest');
      },
      onUpdateReady: function() {
        console.log('manifest update ready');
        OfflinePlugin.applyUpdate();
      },
      onUpdated: function() {
        console.log('updated manifest');
        window.location.reload();
      },
    });

    didInstall = true;
  }
  return null;
};
