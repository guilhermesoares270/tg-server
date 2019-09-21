'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')


Route.group(function() {
  Route.post('/users', 'UserController.create');
  Route.patch('/users', 'UserController.alter').middleware('auth');
  Route.post('/sessions', 'SessionController.create');
  Route.get('/sessions', 'SessionController.refresh');

  Route.post('/file', 'UserController.hashFile');
  Route.get('/file', 'UserController.generateKeys');
  Route.post('/jwt', 'UserController.createJWT');

  Route.get('/signedJWT', 'UserController.createSignedJWT')

  Route.get('/ethTest', 'UserController.eth');
  Route.post('ethTransaction', 'UserController.ethTransaction');
  Route.get('/createEthAccount', 'UserController.createEthereumAccount');

}).prefix('/api/v1')


