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
  Route.patch('/users/:id', 'UserController.alter').middleware('auth');
  Route.get('/users/:id', 'UserController.get');
  Route.get('/users', 'UserController.index');
  Route.delete('/users/:id', 'UserController.delete');

  Route.post('/enterprises', 'EnterpriseController.create');
  Route.patch('/enterprises/:id', 'EnterpriseController.alter').middleware('auth');
  Route.get('/enterprises/:cnpj', 'EnterpriseController.get');
  Route.get('/enterprises', 'EnterpriseController.index');
  Route.delete('/enterprises/:id', 'EnterpriseController.delete');

  Route.post('/sessions', 'SessionController.create');
  Route.get('/sessions', 'SessionController.refresh');

  Route.post('/file', 'UserController.hashFile');
  Route.get('/file', 'UserController.generateKeys');
  Route.get('/signedJWT', 'UserController.createSignedJWT');

  //Ganache
  Route.get('/ganache/deploy', 'BlockchainController.ganacheDeployContract');
  Route.get('/ganache/getDoc', 'BlockchainController.getDocument');
  Route.get('/ganache/count', 'BlockchainController.docsCount');
  Route.get('/ganache/index', 'BlockchainController.index');
  Route.post('/ganache/', 'BlockchainController.create');
  Route.get('/ganache/enterprise', 'BlockchainController.getEnterprise');

}).prefix('/api/v1')


