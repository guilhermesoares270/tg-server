'use strict'

const Enterprise = use("App/Models/Enterprise");
const BlockchainController = use("App/Controllers/Http/BlockchainController");

class EnterpriseController {
  async create({ request }) {
    const data = request.only(["razao_social", "cnpj", "email", "password", "cep"]);

    const enterprise = await Enterprise.create(data);
    // const blockchainController = new BlockchainController();
    // await blockchainController.deploy(data.razao_social, data.cnpj);

    return enterprise;
  }

  async alter({ request, params }) {
    const { id } = params;
    const data = request.only(["razao_social", "cnpj", "email", "password", "cep"]);

    const enterprise = await Enterprise.findBy(
      "id", id
    );

    const { ...newData } = data;
    enterprise.merge(newData);

    await enterprise.save();

    return enterprise;
  }

  async delete({ params }) {
    const enterprise = await Enterprise.findBy(
      "id", params.id
    );
    if (!enterprise) return {};

    return enterprise.delete();
  }

  async get({ params }) {
    return await Enterprise.findBy(
      "cnpj", params.cnpj
    );
  }

  async index() {
    return await Enterprise.all();
  }
}

module.exports = EnterpriseController
