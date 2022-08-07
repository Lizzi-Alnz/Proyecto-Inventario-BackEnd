const express = require('express');
const router = express.Router();
const Citas = require('../../../../libs/citas');
const CitasDao = require('../../../../dao/mongodb/models/CitasDao');
const citDao = new CitasDao();
const cit = new Citas(citDao);
cit.init();
router.get('/all', async (req, res) => {
  try {
    const citas = await cit.getCarnet();
    return res.status(200).json(citas);
  } catch (ex) {
    console.error(ex);
    return res.status(501).json({error:'Error al procesar solicitud.'});
  }
});

router.get('/byid/:identidad', async (req, res) => {
  try {
    const {identidad} = req.params;
    const registro = await cit.getCitasById({identidad});
    return res.status(200).json(registro);
  } catch (ex) {
    console.error(ex);
    return res.status(501).json({ error: 'Error al procesar solicitud.' });
  }
} );

router.post('/new', async (req, res) => {
  try {
    const {fecha='',identidad='',establecimiento=''} = req.body;
    const newCitas = await cit.addCitas({fecha,identidad,establecimiento});
    return res.status(200).json(newCitas);
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

    const deletedCitas = await cit.deleteCitas({ identidad });

    if (!deletedCitas) {
      return res.status(404).json({ error: 'Carnet no encontrado.' });
    }
    return res.status(200).json({ deletedCitas});

  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: 'Error al procesar solicitud.' });
  }
});

module.exports = router;