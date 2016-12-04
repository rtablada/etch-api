'use strict';

/*
|--------------------------------------------------------------------------
| Test Bootstrap
|--------------------------------------------------------------------------
| Bootstrap file to setup adonisjs providers before running the test.
|
*/

const app = require('../../../bootstrap/app');
const fold = require('adonis-fold');
const path = require('path');
const packageFile = path.join(__dirname, '../../../package.json');
require('../../../bootstrap/extend');

module.exports = function* () {
  yield fold.Registrar
    .register(app.providers.concat(app.aceProviders));

  /*
  |--------------------------------------------------------------------------
  | Register Aliases
  |--------------------------------------------------------------------------
  |
  | After registering all the providers, we need to setup aliases so that
  | providers can be referenced with short sweet names.
  |
  */
  fold.Ioc.aliases(app.aliases);

  /*
  |--------------------------------------------------------------------------
  | Register Package File
  |--------------------------------------------------------------------------
  |
  | Adonis application package.json file has the reference to the autoload
  | directory. Here we register the package file with the Helpers provider
  | to setup autoloading.
  |
  */
  const Helpers = use('Helpers');
  Helpers.load(packageFile, fold.Ioc);

  /*
  |--------------------------------------------------------------------------
  | Register Events
  |--------------------------------------------------------------------------
  |
  | Here we require the event.js file to register events defined inside
  | events.js file.
  |
  */
  require('../../../bootstrap/events');

  /*
  |--------------------------------------------------------------------------
  | Load Middleware And Routes
  |--------------------------------------------------------------------------
  |
  | Middleware and Routes are required to oil up your HTTP server. Here we
  | require defined files for same.
  |
  */
  use(Helpers.makeNameSpace('Http', 'kernel'));
  use(Helpers.makeNameSpace('Http', 'routes'));

  /*
  |--------------------------------------------------------------------------
  | Start Http Server
  |--------------------------------------------------------------------------
  |
  | We are all set to fire the Http Server and start receiving new requests.
  |
  */
  const server = use('Adonis/Src/Server');

  /*
  |--------------------------------------------------------------------------
  | Firing Start Event
  |--------------------------------------------------------------------------
  */
  const Event = use('Event');
  Event.fire('Http.start');

  const Database = use('Database');

  /*
  |--------------------------------------------------------------------------
  | Setup Ace Commands
  |--------------------------------------------------------------------------
  |
  */
  const ace = require('adonis-ace');
  ace.register(app.commands);

  return { server, ace, Database, Event, Helpers, app };
    // .catch(error => console.error(error.stack));
};
