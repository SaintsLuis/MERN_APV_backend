/** Router Paciente */

// Importamos el paquete 'express' para crear el router y las funciones controladoras para manejar las solicitudes a las rutas.
import express from 'express';
import { agregarPaciente, obtenerPacientes, obtenerPaciente, actualizarPaciente, eliminarPaciente } from '../controllers/pacienteController.js';

// Importamos el middleware de autenticación para proteger las rutas.
import checkAuth from '../middleware/authMiddleware.js';

// Creamos una instancia de Router de express.
const router = express.Router();

// Definimos las rutas y los métodos HTTP correspondientes.
// Para la ruta '/' se definen los métodos POST y GET. El middleware checkAuth se ejecutará antes de procesar la solicitud para verificar si el usuario está autenticado.
router.route('/').post(checkAuth, agregarPaciente).get(checkAuth, obtenerPacientes);

// Para la ruta '/:id' se definen los métodos GET, PUT y DELETE. El middleware checkAuth se ejecutará antes de procesar la solicitud para verificar si el usuario está autenticado.
router.route('/:id').get(checkAuth, obtenerPaciente).put(checkAuth, actualizarPaciente).delete(checkAuth, eliminarPaciente);

// Exportamos el router como un módulo para su uso en la aplicación.
export default router;
