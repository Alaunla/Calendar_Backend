const { response } = require("express");
const evento = require("../models/evento");

// Obtiene eventos
const getEvento = async ( req, res = response ) => {
    const eventos = await evento.find().populate('user','name');

    res.json({
        ok: true,
        eventos
    })
}

// Crea un nuevo evento
const crearEvento = async ( req, res = response ) => { 

    //Verificar que tenga un end point
    const events = new evento( req.body );

    try {
        events.user = req.uid;
        const eventoGuardado = await events.save();

        res.json({
            ok: true,
            evento: eventoGuardado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al crear un evento'
        });
    }
}

// Actualizar un evento
const actualizarEvento = async ( req, res = response ) => {
    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        
        const events = await evento.findById( eventoId );
        if ( !events ){
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese ID'
            });
        }

        if ( events.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de edicion'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } );
        res.json({
            ok: true,
            evento: eventoActualizado
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar Datos'
        })
    }
}

// Eliminar un evento
const eliminarEvento = async ( req, res = response ) => {
    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        
        const events = await evento.findById( eventoId );
        if ( !events ){
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese ID'
            });
        }

        if ( events.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de eliminacion'
            });
        }

        await evento.findByIdAndDelete( eventoId );
        res.json({
            ok: true,
            msg: 'El documento a sido eliminado'
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error al borrar Datos'
        })
    }
}

module.exports = {
    getEvento,
    crearEvento,
    actualizarEvento,
    eliminarEvento,
}