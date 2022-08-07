const DaoObject = require('../../dao/mongodb/DaoObject');
module.exports = class Carnet {
  CarnetDao = null;

  constructor(CarnetDao = null) {
    if (!(CarnetDao instanceof DaoObject)) {
      throw new Error('An Instance of DAO Object is Required');
    }
    this.CarnetDao = CarnetDao;
  }
  async init() {
    await this.CarnetDao.init();
    await this.CarnetDao.setup();
  }
  async getVersion() {
    return {
      entity: 'Carnet',
      version: '1.0.0',
      description: 'CRUD de Carnet'
    };
  }

  async addCarnet({
    nombre,
    identidad,
    fechanacimiento,
    sexo,
    direccion,
    numero,
    establecimiento,
  }) {
    const result = await this.CarnetDao.insertOne(
      {
        nombre,
    identidad,
    fechanacimiento,
    sexo,
    direccion,
    numero,
    establecimiento
      }
    );
    return {
        nombre,
        identidad,
        fechanacimiento,
        sexo,
        direccion,
        numero,
        establecimiento,
      result
    };
  };

  async getCarnet() {
    return this.CarnetDao.getAll();
  }

  async getCarnetById({ identidad }) {
    return this.CarnetDao.findOne({ identidad });
  }

  async deleteCarnet({ identidad }) {
    const carnetToDelete = await this.CarnetDao.getById({ identidad });
    const result = await this.CarnetDao.deleteOne({ identidad });
    return {
      ...carnetToDelete,
      deleted: result.changes
    };
  }
}
