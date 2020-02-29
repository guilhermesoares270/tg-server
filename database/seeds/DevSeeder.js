const Factory = use('Factory')
const Database = use('Database')

class UserSeeder {
  async run() {
    await Database.table('enterprises').insert({
      razao_social: "empresa1",
      cnpj: "89797",
      email: "empresa1@gmail.com",
      password: "empresa1",
      cep: "12710400"
    });

    await Database.table('users').insert({
      username: "Teste",
      email: "teste@gmail.com",
      password: "123",
      razao_social: "empresa1"
    });
  }
}

module.exports = UserSeeder
