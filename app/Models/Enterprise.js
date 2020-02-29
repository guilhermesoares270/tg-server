'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Enterprise extends Model {

  static boot() {
    super.boot()
  }

  users() {
    return this.hasMany('App/Models/User');
  }
}

module.exports = Enterprise;
