const DaoObject = require('../../dao/mongodb/DaoObject');
module.exports = class Cita {
    CitasDao = null;

  constructor(CitasDao = null) {
    if (!(CitasDao instanceof DaoObject)) {
      throw new Error('An Instance of DAO Object is Required');
    }
    this.CitasDao = CitasDao;
  }
  async init() {
    await this.CitasDao.init();
    await this.CitasDao.setup();
  }
  async getVersion() {
    return {
      entity: 'Citas',
      version: '1.0.0',
      description: 'CRUD de Citas'
    };
  }

  async addCitas({
    fecha,identidad,establecimiento
  }) {
    const result = await this.CitasDao.insertOne(
      {
        fecha,identidad,establecimiento
      }
    );
    return {
        fecha,identidad,establecimiento,result
    };
  };

  async getCitas() {
    return this.CitasDao.getAll();
  }

  async getCitasById({ identidad }) {
    return this.CitasDao.findOne({ identidad });
  }

  async deleteCitas({ identidad }) {
    const CitasToDelete = await this.CitasDao.getById({ identidad });
    const result = await this.CitasDao.deleteOne({ identidad });
    return {
      ...CitasToDelete,
      deleted: result.changes
    };
  }
}