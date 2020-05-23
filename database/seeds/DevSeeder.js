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

// 27 | empresa1     | 897975  | empresa1@gmail.com | empresa1 | 0x5dbb5c21EC4bfE0
// 9fC96674a3050bAbE9FaAc222 |       | 12710400 | 2020-05-17 09:46:06+00 | 2020-05-
// 17 09:46:06+00
//  32 | empresaC     | 8979756 | empresaC@gmail.com | empresa1 | 0xc497b317e0623ce
// 1Ed54408b3EA977e367b5B728 |       | 12710400 | 2020-05-20 17:26:38+00 | 2020-05-
// 20 20:27:26+00
