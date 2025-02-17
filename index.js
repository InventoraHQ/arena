const express = require('express');
const path = require('path');
const basicAuth = require('express-basic-auth');
const Arena = require('./src/server/app');
const routes = require('./src/server/views/routes');

function run(config, listenOpts = {}) {
  const {app, Queues} = Arena(config);
  const {authUsername, authPassword} = listenOpts;

  if (authUsername && authPassword) {
    console.log('BASIC AUTH ENABLED');

    app.use(
      basicAuth({
        challenge: true,
        users: {
          [authUsername]: authPassword,
        },
      })
    );
  } else {
    console.log('BASIC AUTH DISABLED!!!!!!!');
  }

  Queues.useCdn =
    typeof listenOpts.useCdn !== 'undefined' ? listenOpts.useCdn : true;

  app.locals.appBasePath = listenOpts.basePath || app.locals.appBasePath;

  app.use(
    app.locals.appBasePath,
    express.static(path.join(__dirname, 'public'))
  );

  app.use(app.locals.appBasePath, routes);

  const port = listenOpts.port || 4567;
  const host = listenOpts.host || '0.0.0.0'; // Default: listen to all network interfaces.
  if (!listenOpts.disableListen) {
    app.listen(port, host, () => {
      console.log(`Arena is running on port ${port} at host ${host}`);
    });
  }

  return app;
}

module.exports = run;
