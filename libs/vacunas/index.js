const DaoObject = require('../../dao/mongodb/DaoObject');
module.exports = class Vacuna {
  VacunaDao = null;

  constructor(VacunaDao = null) {
    if (!(VacunaDao instanceof DaoObject)) {
      throw new Error('An Instance of DAO Object is Required');
    }
    this.VacunaDao = VacunaDao;
  }
  async init() {
    await this.VacunaDao.init();
    await this.VacunaDao.setup();
  }
  async getVersion() {
    return {
      entity: 'Vacuna',
      version: '1.0.0',
      description: 'CRUD de Vacuna'
    };
  }

  async addVacuna({
    vacuna,fecha,identidad
  }) {
    const result = await this.VacunaDao.insertOne(
      {
        vacuna,fecha,identidad
      }
    );
    return {
        vacuna,fecha,identidad,result
    };
  };

  async getVacuna() {
    return this.VacunaDao.getAll();
  }

  async getVacunaById({ identidad }) {
    return this.VacunaDao.findOne({ identidad });
  }

  async deleteVacuna({ identidad }) {
    const vacunaToDelete = await this.VacunaDao.getById({ identidad });
    const result = await this.VacunaDao.deleteOne({ identidad });
    return {
      ...vacunaToDelete,
      deleted: result.changes
    };
  }
}