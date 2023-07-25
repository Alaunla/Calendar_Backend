const { Router } = require("express");
const { validarJWT } = require('../middlewares/validar-jwt')

const { getEvento, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { isDate } = require("../helpers/isDate");

const router = Router();

// Obliga a usar un token
router.use( validarJWT );

// Obtener eventos
router.get( '/', getEvento);

// Crear evento
router.post(
    '/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'La Fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'La Fecha de finalización es obligatoria').custom( isDate ),
        validarCampos
    ],
    crearEvento);

// Actualizar evento
router.put(
    '/:id',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'La Fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'La Fecha de finalización es obligatoria').custom( isDate ),
        validarCampos
    ],
    actualizarEvento);

// Eliminar evento
router.delete('/:id', eliminarEvento );

module.exports = router;