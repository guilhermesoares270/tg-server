'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EnterprisesSchema extends Schema {
  up() {
    this.create('enterprises', (table) => {
      table.increments()
      table.string('razao_social', 255).notNullable().unique()
      table.string('cnpj', 30).notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.string('phone', 30)
      table.string('cep', 30)
      table.timestamps()
    })
  }

  down() {
    this.drop('enterprises')
  }
}

module.exports = EnterprisesSchema
