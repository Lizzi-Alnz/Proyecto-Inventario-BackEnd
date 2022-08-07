const express =require('express');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
let router = express.Router();
const Usuario = require('../../../../libs/usuarios');
const UsuarioDao = require('../../../../dao/mongodb/models/UsuarioDao');
const userDao = new UsuarioDao();
const user = new Usuario(userDao);
user.init();

const {jwtSign} = require('../../../../libs/security');

router.post('/login', async (req, res)=>{
  try {
    const {email, password} = req.body;
    const userData = await user.getUsuarioByEmail({email});
    const fecha = new Date();
    console.log(userData);
    if(password == userData.passwordtemp && userData.expiracion > fecha){
      console.log("Contraseña Correcta");
    } else if(! user.comparePasswords(password, userData.password)) {
      console.error('security login: ', {error:`Credenciales para usuario ${userData._id} ${userData.email} incorrectas.`});
      return res.status(403).json({ "error": "Credenciales no Válidas" });
    }
    const {password: passwordDb, created, updated, ...jwtUser} = userData;
    const jwtToken = await jwtSign({jwtUser, generated: new Date().getTime()});
    return res.status(200).json({token: jwtToken, nombre: userData.nombre});
  } catch (ex) {
    console.error('security login: ', {ex});
    return res.status(500).json({"error":"No es posible procesar la solicitud."});
  }
});

router.post('/signin', async (req, res) => {
  try {
    const {email, password,nombre,identidad,sexo,fechanacimiento,direccion} = req.body;
    console.log(email);
    console.log(password);
    if (/^\s*$/.test(email)) {
      return res.status(400).json({
        error: 'Se espera valor de correo'
      });
    }

    if (/^\s*$/.test(password)) {
      return res.status(400).json({
        error: 'Se espera valor de contraseña correcta'
      });
    }
    const newUsuario = await user.addUsuario({
      email,
      nombre,identidad,sexo,fechanacimiento,direccion,
      password,
    });
    return res.status(200).json(newUsuario);
  } catch (ex) {
    console.error('security signIn: ', ex);
    return res.status(502).json({ error: 'Error al procesar solicitud' });
  }
});





router.post('/recuperar', async (req, res)=>{
  try {
    let testAccount = await nodemailer.createTestAccount();
    const {email} = req.body;
    const userData = await user.getUsuarioByEmail({email});
    const codigo = userData._id;
    if(!userData) {
      return res.status(403).json({ "error": "Correo no existente" });
    }
    let transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth:{
        user: process.env.APP_CORREO,
        pass: process.env.CORREO_CONTRASENA
    },
    STARTTLS: {
      rejectUnauthorized: false
  }
    });

    const minus = "abcdefghijklmnñopqrstuvwxyz";
    const mayus = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    var passwordtemp = '';
    for (var i = 1; i <= 8; i++) {
      var eleccion = Math.floor(Math.random() * 3 + 1);
      if (eleccion == 1) {
        var caracter1 = minus.charAt(Math.floor(Math.random() * minus.length));
        passwordtemp += caracter1;
      } else {
        if (eleccion == 2) {
          var caracter2 = mayus.charAt(Math.floor(Math.random() * mayus.length));
          passwordtemp += caracter2;
        } else {
          var num = Math.floor(Math.random() * 10);
          passwordtemp += num;
        }
      }
    }
    let info = transporter.sendMail({
      from: process.env.APP_CORREO, // sender address
      to: email, // list of receivers
      subject: "Recuperar contraseña", // Subject line
      text: 'Contraseña administrativa: '+passwordtemp, // plain text body
      html: "<b>Contraseña temporal: </b>"+passwordtemp, // html body
    });
    const userDat = await user.updatePassword({codigo,passwordtemp});
    return res.status(200).json("Enviado");
  } catch (ex) {
    console.error('security login: ', {ex});
    return res.status(500).json({"error":"No es posible procesar la solicitud."});
  }
});

router.post('/updatepassword', async (req, res) => {
  try {
    const fecha = new Date();
    const {email,password,oldpassword} = req.body;
    if (/^\s*$/.test(password)) {
      return res.status(400).json({
        error: 'Se espera valor de contraseña correcta'
      });
    }
    if (/^\s*$/.test(oldpassword)) {
      return res.status(400).json({
        error: 'Se espera valor de contraseña correcta'
      });
    }
    const userData = await user.getUsuarioByEmail({email});
    const codigo = userData._id;
    if(oldpassword == userData.passwordtemp && userData.expiracion > fecha){
      console.log("Contraseña Correcta");
    }else
    {
    return res.status(403).json("Contraseña o correo incorrecto");
    }
    const newpass = await user.newPass({codigo,password});
    return res.status(200).json("Nueva contraseña almacenada correctamente");
  } catch (ex) {
    console.error('security signIn: ', ex);
    return res.status(502).json({ error: 'Error al procesar solicitud' });
  }
});


module.exports = router;
