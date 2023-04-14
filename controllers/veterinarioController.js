/** Veterinario Controller  */

// Importar el modelo de veterinario
import Veterinario from '../models/Veterinario.js';

// Importar las funciones de ayuda
import generarJWT from '../helpers/generarJWT.js';
import generarId from '../helpers/generarId.js';
import emailRegistro from '../helpers/emailRegistro.js';
import emailOlvidePassword from '../helpers/emailOlvidePassword.js';

// Registrar un nuevo veterinario
const registrar = async (req, res) => {
    const { email, nombre } = req.body;

    // Prevenir usuarios duplicados | Buscar si ya existe un usuario con este email
    const existeUsuario = await Veterinario.findOne({ email });
    // Si el usuario ya existe, enviar un mensaje de error
    if (existeUsuario) {
        console.log(existeUsuario);
        const error = new Error('Usuario ya Registrado ');
        return res.status(400).json({ msg: error.message });
    }

    try {
        // Guardar el nuevo veterinario en la base de datos
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        // Enviar el email |mailtrap Nodemailer
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token,
        });

        res.json(veterinarioGuardado);
    } catch (error) {
        console.log(error);
    }
};

// Obtener el perfil del veterinario
const perfil = (req, res) => {
    const { veterinario } = req;
    res.json(veterinario);
};

// Confirmar la cuenta de un veterinario
const confirmar = async (req, res) => {
    const { token } = req.params;

    // Buscar el usuario por su token de confirmación
    const usuarioConfirmar = await Veterinario.findOne({ token });

    // Si el usuario no existe, enviar un mensaje de error
    if (!usuarioConfirmar) {
        const error = new Error('Token no válido');
        return res.status(404).json({ msg: error.message });
    }

    try {
        // Confirmar la cuenta del usuario y guardar los cambios en la base de datos
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();
        res.json({ msg: 'Usuario Confirmado Correctamente' });
    } catch (error) {
        console.log(error);
    }
};

// Autenticar a un veterinario
const autenticar = async (req, res) => {
    const { email, password } = req.body;

    // Buscar al usuario por su email
    const usuario = await Veterinario.findOne({ email });

    // Si el usuario no existe, enviar un mensaje de error
    if (!usuario) {
        const error = new Error('El Usuario No Existe');
        return res.status(404).json({ msg: error.message });
    }

    // Si el usuario no ha confirmado su cuenta, enviar un mensaje de error
    if (!usuario.confirmado) {
        const error = new Error('Tu Cuenta no ha sido confirmada');
        return res.status(403).json({ msg: error.message });
    }

    // Comprobar si el password es correcto
    if (await usuario.comprobarPassword(password)) {
        // Si el password es correcto, enviarlo como respuesta, GenerarJWT| Autenticar
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id),
        });
    } else {
        const error = new Error('El Password es Incorrecto');
        return res.status(403).json({ msg: error.message });
    }
};

// Olvide el Password
const olvidePassword = async (req, res) => {
    // Obtenemos el email del cuerpo de la petición
    const { email } = req.body;

    // Buscamos un veterinario en la base de datos con el email proporcionado
    const existeVeterinario = await Veterinario.findOne({ email });

    // Si el veterinario no existe, respondemos con un error
    if (!existeVeterinario) {
        const error = new Error('El Usuario no existe');
        return res.status(400).json({ msg: error.message });
    }

    try {
        // Generamos un token aleatorio
        existeVeterinario.token = generarId();
        await existeVeterinario.save();

        // Enviar Email con instrucciones
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token,
        });

        res.json({ msg: 'Hemos enviado un email con las instrucciones' });
    } catch (error) {
        console.log(error);
    }
};

// Comprobar Token del Password
const comprobarToken = async (req, res) => {
    // Obtenemos el token de los parámetros de la petición
    const { token } = req.params;

    // Buscamos un veterinario en la base de datos con el token proporcionado
    const usuarioConfirmar = await Veterinario.findOne({ token });

    // Si el veterinario existe, respondemos con un mensaje indicando que el token es válido
    if (usuarioConfirmar) {
        // El Token es valido, el usuario existe
        res.json({ msg: 'Token válido y el usuario existe' });
    } else {
        // Si el veterinario no existe, respondemos con un error
        const error = new Error('Token no Valido');
        return res.status(400).json({ msg: error.message });
    }
};

// Nuevo Password
const nuevoPassword = async (req, res) => {
    // Obtenemos el token de los parámetros de la petición y el nuevo password del cuerpo de la petición
    const { token } = req.params;
    const { password } = req.body;

    // Buscamos un veterinario en la base de datos con el token proporcionado
    const veterinario = await Veterinario.findOne({ token });

    // Si el veterinario no existe, respondemos con un error
    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    try {
        // Actualizamos el token del veterinario a null y su password con el nuevo valor
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({ msg: 'Password modificado correctamente' });
    } catch (error) {
        console.log(error);
    }
};

// Función para actualizar el perfil de un veterinario
const actualizarPerfil = async (req, res) => {
    // Buscamos en la BD el veterinario que estamos actualizando
    const veterinario = await Veterinario.findById(req.params.id);

    // Si no se encontró un veterinario, devolvemos un error
    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ text: error.message });
    }

    // Evitamos actualizar a un email que ya exista en la BD
    const { email } = req.body;
    if (veterinario.email !== req.body.email) {
        const existeEmail = await Veterinario.findOne({ email });
        if (existeEmail) {
            const error = new Error('Ese Email Ya Está En Uso'); // Ej de error pasandole a *SweetAlert*
            return res.status(400).json({ text: error.message });
        }
    }

    try {
        // Actualizamos los datos del veterinario con los datos enviados
        veterinario.nombre = req.body.nombre;
        veterinario.email = req.body.email;
        veterinario.web = req.body.web;
        veterinario.telefono = req.body.telefono;

        // Guardamos los cambios en la BD
        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado);
    } catch (error) {
        console.log(error);
    }
};

// Función para actualizar el Password de un veterinario
const actualizarPassword = async (req, res) => {
    // Leer los datos
    const { id } = req.veterinario;
    const { pwd_actual, pwd_nuevo } = req.body;

    //  Comprobar que el veterinario existe | Buscamos en la BD el veterinario que estamos actualizando
    const veterinario = await Veterinario.findById(id);
    // Si no se encontró un veterinario, devolvemos un error
    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ text: error.message });
    }

    // Comprobar su password
    if (await veterinario.comprobarPassword(pwd_actual)) {
        // Almacenar el nuevo password

        veterinario.password = pwd_nuevo;
        // Guardamos los cambios en la BD
        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado);
    } else {
        const error = new Error('El Password Actual Es Incorrecto'); // Ej de error pasandole a *SweetAlert*
        return res.status(400).json({ text: error.message });
    }
};

// Exportamos las funciones
export { registrar, perfil, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword, actualizarPerfil, actualizarPassword };
