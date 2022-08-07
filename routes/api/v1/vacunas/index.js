const express = require('express');
const router = express.Router();
const Vacunas = require('../../../../libs/vacunas');
const VacunasDao = require('../../../../dao/mongodb/models/VacunasDao');
const vacDao = new VacunasDao();
const vac = new Vacunas(vacDao);
vac.init();
router.get('/all', async (req, res) => {
  try {
    const vacunas = await vac.getVacuna();
    return res.status(200).json(vacunas);
  } catch (ex) {
    console.error(ex);
    return res.status(501).json({error:'Error al procesar solicitud.'});
  }
});

router.get('/byid/:identidad', async (req, res) => {
  try {
    const {identidad} = req.params;
    const registro = await vac.getVacunaById({identidad});
    return res.status(200).json(registro);
  } catch (ex) {
    console.error(ex);
    return res.status(501).json({ error: 'Error al procesar solicitud.' });
  }
} );

router.post('/new', async (req, res) => {
  try {
    const {vacuna = '', fecha='', identidad=''} = req.body;
    if (/^\s*$/.test(vacuna)) {
      return res.status(400).json({
        error: 'Se espera valor de categoría'
      });
    }
    const newVacuna = await vac.addVacuna({vacuna, fecha,identidad});
    return res.status(200).json(newVacuna);
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

    const deletedVacuna = await cat.deleteVacuna({ identidad });

    if (!deletedVacuna) {
      return res.status(404).json({ error: 'Vacuna no encontrada.' });
    }
    return res.status(200).json({ deletedVacuna});

  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: 'Error al procesar solicitud.' });
  }
});

module.exports = router;
