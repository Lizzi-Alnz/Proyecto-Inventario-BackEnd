const { db } = require('../Connection');
const DaoObject = require('../DaoObject');
module.exports = class UsuariosDao extends DaoObject {
  constructor(db = null) {
    super(db, 'usuarios');
  }
  async setup() {
    if (process.env.MONGODB_SETUP) {
     const indexExists = await this.collection.indexExists('email_1');
     if (!indexExists) {
      await this.collection.createIndex({email:1}, {unique:true});
     }
    }
  }

  getAll() {
    return this.find();
  }

  getById({ codigo }) {
    return this.findById(codigo);
  }

  getByEmail({ email }) {
    return this.findOne({email});
  }

  insertOne({ email, password, passwordtemp, expiracion, nombre, identidad }) {
    const newUser = {
      email,
      password,
      passwordtemp,
      expiracion,
      nombre,
      identidad,
      created: new Date().toISOString(),
    }
    return super.insertOne(newUser);
  }

  updateOne({ codigo, password,passwordtemp, expiracion, nombre, avatar,identidad, estado }) {
    const updateCommand = {
      "$set": {
        nombre,
        password,
        passwordtemp,
        expiracion,
        avatar,
        identidad,
        estado,
        updated: new Date().toISOString()
      }
    }
    return super.updateOne(codigo, updateCommand);}

    updatePass({ codigo,passwordtemp}) {
    const fecha = new Date();
    fecha.setSeconds(28800);
    console.log(fecha);
    const updateCommand = {
      "$set": {
        passwordtemp,
        expiracion: fecha,
        updated: new Date().toISOString()
      }
    }
    return super.updateOne(codigo, updateCommand);
  }

  newPassword({ codigo,password}){
    const updateCommand = {
      "$set": {
        password,
        updated: new Date().toISOString()
      }
    }
    return super.updateOne(codigo, updateCommand);
  }


  deleteOne({ codigo }) {
    const updateCommand = {
      "$set": {
        estado:'INA',
        updated: new Date().toISOString()
      }
    }
    return super.updateOne(codigo, updateCommand);
  }

}
