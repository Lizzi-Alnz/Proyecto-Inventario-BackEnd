const { db } = require('../Connection');
const DaoObject = require('../DaoObject');
module.exports = class CarnetDao extends DaoObject {
  constructor(db = null) {
    console.log('CarnetDao db: ', db);
    super(db, 'Carnet');
  }
  async setup() {
    if (process.env.MONGODB_SETUP) {
     // TODO: Agregar Indices
    }
  }

  getAll() {
    return this.find();
  }
  getById({codigo}) {
    return this.findOne(codigo);
  }
  insertOne({ nombre,identidad,fechanacimiento,sexo,direccion,numero,establecimiento }) {
    return super.insertOne({nombre,identidad,fechanacimiento,sexo,direccion,numero,establecimiento,created: new Date().toISOString()});
  }
  updateOne({ codigo, nombre,identidad,fechanacimiento,sexo,direccion,numero,establecimiento }) {
    const updateCommand = {
      '$set': {
        nombre,
        identidad,
        fechanacimiento,
        sexo,
        direccion,
        numero,
        establecimiento,
        updated: new Date().toISOString()
      }
    };
    return super.updateOne(codigo, updateCommand);
  }
  deleteOne({ codigo }) {
    return super.removeOne(codigo);
  }
}