/** Paciente Controller */

// Importamos el modelo Paciente.
import Paciente from '../models/Paciente.js';

// Función controladora para agregar un nuevo paciente.
const agregarPaciente = async (req, res) => {
    // Creamos una nueva instancia del modelo Paciente con los datos recibidos en la solicitud.
    const paciente = new Paciente(req.body);

    // Agregamos el ID del veterinario que está haciendo la solicitud al objeto paciente.
    paciente.veterinario = req.veterinario._id;

    try {
        // Intentamos guardar el nuevo paciente en la base de datos.
        const pacienteAlmacenado = await paciente.save();

        // Enviamos una respuesta JSON con el objeto paciente recién almacenado.
        res.json(pacienteAlmacenado);
    } catch (error) {
        // Si ocurre un error, lo mostramos en la consola.
        console.log(error);
    }
};

// Función controladora para obtener todos los pacientes asociados a un veterinario específico.
const obtenerPacientes = async (req, res) => {
    // Buscamos todos los pacientes en la base de datos que estén asociados con el veterinario que está haciendo la solicitud.
    const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario);

    // Enviamos una respuesta JSON con todos los pacientes encontrados.
    res.json(pacientes);
};

// Función controladora para obtener un paciente específico por su ID.
const obtenerPaciente = async (req, res) => {
    const { id } = req.params;

    // Buscamos el paciente en la base de datos con el ID especificado.
    const paciente = await Paciente.findById(id);

    // Si no se encuentra el paciente, enviamos una respuesta con un estado 404 y un mensaje de error.
    if (!paciente) {
        return res.status(404).json({ msg: 'No Encontrado' });
    }

    // Si el veterinario que está haciendo la solicitud no es el mismo que el que creó el paciente, enviamos una respuesta con un mensaje de error.
    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({ msg: 'Accion no válida' });
    }

    // Enviamos una respuesta JSON con el paciente encontrado.
    res.json(paciente);
};

// Función controladora para actualizar un paciente específico por su ID.
const actualizarPaciente = async (req, res) => {
    const { id } = req.params;
    // Buscamos el paciente en la base de datos con el ID especificado.
    const paciente = await Paciente.findById(id);

    // Si no se encuentra el paciente, enviamos una respuesta con un estado 404 y un mensaje de error.
    if (!paciente) {
        return res.status(404).json({ msg: 'No Encontrado' });
    }

    // Si el veterinario que está haciendo la solicitud no es el mismo que el que creó el paciente, enviamos una respuesta con un mensaje de error.
    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({ msg: 'Accion no válida' });
    }

    // Actualizar Paciente
    // Actualiza el nombre del paciente si se proporciona en la solicitud, de lo contrario(||), conserva el nombre existente
    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;

    try {
        // Guarda el paciente ya actualizado
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado);
    } catch (error) {
        console.log(error);
    }
};

// Función controladora para eliminar un paciente específico por su ID.
const eliminarPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if (!paciente) {
        return res.status(404).json({ msg: 'No Encontrado' });
    }

    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({ msg: 'Accion no válida' });
    }

    try {
        // Elimina el paciente (encontrado por su ID) mediante el metodo deleteOne()
        await paciente.deleteOne();
        res.json({ msg: 'Paciente Eliminado' });
    } catch (error) {
        console.log(error);
    }
};

// Exportar las funciones controladoras
export { agregarPaciente, obtenerPacientes, obtenerPaciente, actualizarPaciente, eliminarPaciente };
