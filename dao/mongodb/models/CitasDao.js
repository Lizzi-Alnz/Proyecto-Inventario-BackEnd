const { db } = require('../Connection');
const DaoObject = require('../DaoObject');
module.exports = class CitasDao extends DaoObject {
  constructor(db = null) {
    console.log('CarnetDao db: ', db);
    super(db, 'Cita');
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
    return this.findOne(identidad);
  }
  insertOne({ fecha,identidad,establecimiento }) {
    return super.insertOne({fecha,identidad,establecimiento,created: new Date().toISOString()});
  }
  updateOne({ fechacita,identidad }) {
    const updateCommand = {
      '$set': {
        fechacita,identidad,establecimiento,
        updated: new Date().toISOString()
      }
    };
    return super.updateOne(codigo, updateCommand);
  }
  deleteOne({ identidad }) {
    return super.removeOne(identidad);
  }
}