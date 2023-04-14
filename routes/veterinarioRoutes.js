/** Router Veterinario */

// Importamos Express, una herramienta para manejar nuestra aplicación web
import express from 'express';

// Creamos nuestro router
const router = express.Router();

// Importamos algunas funciones para manejar solicitudes que llegan a nuestra aplicación
import {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword,
} from '../controllers/veterinarioController.js';

// Importamos un middleware (checkAuth) que se ejecutará antes de algunas de nuestras rutas para asegurarnos de que el usuario esté logueado
import checkAuth from '../middleware/authMiddleware.js';

// Definimos nuestras rutas públicas (que cualquier persona puede acceder)
router.post('/', registrar); // Registrar un nuevo usuario
router.get('/confirmar/:token', confirmar); // Confirmar una cuenta mediante un enlace enviado por correo electrónico
router.post('/login', autenticar); // Iniciar sesión
router.post('/olvide-password', olvidePassword); // Enviar un correo electrónico para restablecer la contraseña
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword); // Comprobar si el token enviado para restablecer la contraseña es válido y establecer una nueva contraseña

// Definimos nuestras rutas privadas (que solo se pueden acceder si el usuario está logueado)
router.get('/perfil', checkAuth, perfil); // Ver el perfil del usuario logueado
router.put('/perfil/:id', checkAuth, actualizarPerfil);
router.put('/actualizar-password', checkAuth, actualizarPassword);

// Exportamos nuestro router para que se pueda usar en otras partes de nuestra aplicación
export default router;
