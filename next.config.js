const OfflinePlugin = require('offline-plugin');
const fs = require('fs');

module.exports = {
  webpack: (config, { dev }) => {
    const prod = !dev;

    // Offline support
    if (dev || prod) {
      config.plugins.push(
        new OfflinePlugin({
          publicPath: '/',
          relativePaths: false,
          externals: ['/', '/manifest.html'],
          rewrites: function rewrites(asset) {
            if (
              asset.indexOf('.hot-update.js') > -1 ||
              asset.indexOf('build-stats.json') > -1 ||
              asset === 'BUILD_ID' ||
              asset.indexOf('dist/') === 0
            ) {
              return null;
            }
            return asset[0] === '/'
              ? asset
              : asset.indexOf('bundles/pages/') === 0
                  ? `/_next/-/${asset
                      .replace('bundles/pages', 'page')
                      .replace('index.js', '')
                      .replace(/\.js$/, '')}`
                  : `/_next/-/${asset}`;
          },
          autoUpdate: 1000 * 60 * 5, // (five minutes)
          __tests: dev ? { ignoreRuntime: true } : {}, // hack to circumvent check of offlineplugin
          ServiceWorker: null, // not implemented (yet)
          AppCache: {
            directory: './',
            events: true,
          },
        })
        // new SWPrecacheWebpackPlugin({
        //   filename: 'sw.js',
        //   minify: true,
        //   staticFileGlobsIgnorePatterns: [/\.next\//],
        //   staticFileGlobs: [
        //     'static/**/*' // Precache all static files by default
        //   ],
        //   forceDelete: true,
        //   runtimeCaching: [
        //     // Example with different handlers
        //     {
        //       handler: 'fastest',
        //       urlPattern: /[.](png|jpg|css)/
        //     },
        //     {
        //       handler: 'networkFirst',
        //       urlPattern: /^http.*/ //cache all files
        //     }
        //   ]
        // })
      );
    }

    return config;
  },
};
