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

Route.group(function () {
  Route.post('/users', 'UserController.create');
  Route.patch('/users', 'UserController.alter').middleware('auth');

  Route.post('/sessions', 'SessionController.create');
  Route.get('/sessions', 'SessionController.refresh');

  Route.post('/file', 'UserController.hashFile');
  Route.get('/file', 'UserController.generateKeys');
  Route.get('/signedJWT', 'UserController.createSignedJWT');

  //Ganache
  Route.get('/ganache/deploy', 'BlockchainController.ganacheDeployContract');
  Route.get('/ganache/identity', 'BlockchainController.getIdentity');
  Route.get('/ganache/count', 'BlockchainController.docsCount');
  Route.get('/ganache/index', 'BlockchainController.index');
  Route.post('/ganache/', 'BlockchainController.create');

}).prefix('/api/v1')


