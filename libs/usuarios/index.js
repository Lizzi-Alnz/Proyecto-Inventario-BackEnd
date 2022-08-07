const DaoObject = require('../../dao/mongodb/DaoObject');
const bcrypt = require('bcryptjs');
module.exports = class Usuario {
  usuarioDao = null;

  constructor(usuarioDao = null) {
    if (!(usuarioDao instanceof DaoObject)) {
      throw new Error('An Instance of DAO Object is Required');
    }
    this.usuarioDao = usuarioDao;
  }
  async init() {
    await this.usuarioDao.init();
    await this.usuarioDao.setup();
  }
  async getVersion() {
    return {
      entity: 'Usuarios',
      version: '1.0.0',
      description: 'CRUD de Usuarios'
    };
  }

  async addUsuario({
    email,
    nombre,
    sexo,
    fechanacimiento,
    direccion,
    password,
    identidad
  }) {
    const result = await this.usuarioDao.insertOne(
      {
        email,
        nombre,
        sexo,
        fechanacimiento,
        direccion,
        password: bcrypt.hashSync(password),
        identidad
      }
    );
    return {
      email,
    nombre,
    sexo,
    fechanacimiento,
    direccion,
    identidad,
      result
    };
  };

  async getUsuarios() {
    return this.usuarioDao.getAll();
  }

  async getUsuarioById({ codigo }) {
    return this.usuarioDao.getById({ codigo });
  }

  async getUsuarioByEmail({email}) {
    return this.usuarioDao.getByEmail({email});
  }

  comparePasswords(rawPassword, dbPassword) {
    return bcrypt.compareSync(rawPassword, dbPassword);
  }



  async updateUsuario({
    nombre,
    avatar,
    password,
    estado,
    identidad,
    codigo
    }) {
    const result = await this.usuarioDao.updateOne({
      codigo,
      nombre,
      avatar,
      password: bcrypt.hashSync(password),
      estado,
      identidad });
    return {
      nombre,
      avatar,
      estado,
      identidad,
      codigo,
      modified: result
    }
  }

  async updatePassword({codigo, passwordtemp}) {
    const result = await this.usuarioDao.updatePass({
      codigo,
      passwordtemp});
    return {
      codigo,
      passwordtemp,
      modified: result
    }
  }

  async newPass({codigo,password}){
    const result = await this.usuarioDao.newPassword({
      codigo,
      password: bcrypt.hashSync(password)});
      return{
        codigo,
        password,
        modified: result
      }
  }

  async deleteUsuario({ codigo }) {
    const usuarioToDelete = await this.usuarioDao.getById({ codigo });
    const result = await this.usuarioDao.deleteOne({ codigo });
    return {
      ...usuarioToDelete,
      deleted: result.changes
    };
  }
}
