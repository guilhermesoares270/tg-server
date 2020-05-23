const { hooks } = require('@adonisjs/ignitor');
const InitContracts = require('../app/Services/InitContracts');

hooks.after.httpServer(() => {
  InitContracts();
});
