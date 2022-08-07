const express = require('express');
const router = express.Router();
const Carnet = require('../../../../libs/carnet');
const CarnetDao = require('../../../../dao/mongodb/models/CarnetDao');
const carDao = new CarnetDao();
const car = new Carnet(carDao);
car.init();

//vacunas
const Vacunas = require('../../../../libs/vacunas');
const VacunasDao = require('../../../../dao/mongodb/models/VacunasDao');
const vacDao = new VacunasDao();
const vac = new Vacunas(vacDao);
vac.init();
router.get('/all', async (req, res) => {
  try {
    const carnet = await car.getCarnet();
    return res.status(200).json(carnet);
  } catch (ex) {
    console.error(ex);
    return res.status(501).json({error:'Error al procesar solicitud.'});
  }
});


router.get('/allvacunas', async (req, res) => {
  try {
    const carnet = await car.getCarnet();
    const vacunas = await vac.getVacuna();
    const total=[];
    total.push(carnet);
    total.push(vacunas)
    return res.status(200).json(total);
  } catch (ex) {
    console.error(ex);
    return res.status(501).json({error:'Error al procesar solicitud.'});
  }
});

router.get('/byid', async (req, res) => {
  try {
    const {identidad} = req.body;
    const registro = await car.getCarnetById({identidad});
    return res.status(200).json(registro);
  } catch (ex) {
    console.error(ex);
    return res.status(501).json({ error: 'Error al procesar solicitud.' });
  }
} );

router.post('/new', async (req, res) => {
  try {
    const {nombre= '',identidad= '',fechanacimiento= '',sexo= '',direccion= '',numero= '',establecimiento= ''} = req.body;
    const registro = await car.getCarnetById({identidad});
    if(registro == null){
      const newCarnet = await car.addCarnet({nombre,identidad,fechanacimiento,sexo,direccion,numero,establecimiento});
      return res.status(200).json(newCarnet);
    }
    else{
      return res.status(200).json("Identidad existente");
    }
  } catch(ex){
    console.error(ex);
    return res.status(502).json({error:'Error al procesar solicitud'});
  }
});

router.delete('/delete/:identidad', async (req, res) => {
  try {
    const { identidad } = req.params;
    if (!(/^(\d+)|([\da-f]{24})$/.test(identidad))) {
      return res.status(400).json({ error: 'El codigo debe ser un dígito válido.' });
    }

    const deletedCarnet = await car.deleteCarnet({ identidad });

    if (!deletedCarnet) {
      return res.status(404).json({ error: 'Carnet no encontrado.' });
    }
    return res.status(200).json({ deletedCarnet});

  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: 'Error al procesar solicitud.' });
  }
});

module.exports = router;
