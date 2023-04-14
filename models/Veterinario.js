/**Modelo Veterinario */
/** Este código importa Mongoose y define un modelo de esquema(Schema) de Veterinario 
con diferentes campos y opciones que pueden ser almacenados en una base de datos MongoDB. */

import mongoose from 'mongoose';
import bcrypt from 'bcrypt'; //
import generarId from '../helpers/generarId.js'; // Importar generarId(token)

// Definir el esquema(Schema de mongoose) de Veterinario
const veterinarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    telefono: {
        type: String,
        default: null,
        trim: true,
    },
    web: {
        type: String,
        default: null,
    },
    token: {
        type: String,
        default: generarId(),
    },
    confirmado: {
        type: Boolean,
        default: false,
    },
});

// Middleware para cifrar la contraseña antes de guardar
veterinarioSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Método para comprobar si la contraseña es correcta
veterinarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password);
};

/** Finalmente, se define el modelo de Mongoose a través del método "mongoose.model()" y se exporta por defecto el modelo de veterinario para ser utilizado en otras partes de la aplicación. */
const Veterinario = mongoose.model('Veterinario', veterinarioSchema);
export default Veterinario;
