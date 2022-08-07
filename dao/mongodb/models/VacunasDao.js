const { db } = require('../Connection');
const DaoObject = require('../DaoObject');
module.exports = class VacunaDao extends DaoObject {
  constructor(db = null) {
    console.log('VacunaDao db: ', db);
    super(db, 'Vacuna');
  }
  async setup() {
    if (process.env.MONGODB_SETUP) {
     // TODO: Agregar Indices
    }
  }

  getAll() {
    return this.find();
  }
  getById({identidad}) {
    return this.findById(identidad);
  }
  insertOne({ vacuna,fecha,identidad }) {
    return super.insertOne({vacuna,fecha,identidad,created: new Date().toISOString()});
  }
  deleteOne({ identidad }) {
    return super.removeOne(identidad);
  }
}