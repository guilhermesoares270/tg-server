const Factory = use('Factory')
const Database = use('Database')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class UserSeeder {
  async run() {
    await Database.table('enterprises').insert({
      razao_social: 'empresa1',
      cnpj: '43850031810',
      email: 'empresa1@gmail.com',
      password: 'empresa1',
      cep: '12710400'
    });

    await Database.table('users').insert({
      username: 'Teste',
      email: 'teste@gmail.com',
      password: await Hash.make('123'),
      enterprise_id: 1,
      enterprise_cnpj: '43850031810',
    });
  }
}

module.exports = UserSeeder
