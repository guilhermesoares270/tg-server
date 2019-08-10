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
  Route.get('/sessions', 'SessionController.refresh')
}).prefix('/api/v1')


