/** Modelo Paciente */

// Importar el paquete mongoose
import mongoose from 'mongoose';

// Definir el esquema(Schema de mongoose) para el modelo de Paciente
const pacientesSchema = mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
        },
        propietario: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        fecha: {
            type: Date,
            required: true,
            default: Date.now(), // Definir la fecha por defecto como la fecha actual
        },
        sintomas: {
            type: String,
            required: true,
        },
        veterinario: {
            type: mongoose.Schema.Types.ObjectId, // Definir una relación con el modelo de Veterinario
            ref: 'Veterinario',
        },
    },
    {
        timestamps: true, // Añadir campos de fecha 'createdAt' y 'updatedAt' automáticamente
    },
);

// Crear el modelo de Paciente a partir del esquema definido anteriormente
const Paciente = mongoose.model('Paciente', pacientesSchema);

// Exportar el modelo para que pueda ser utilizado en otras partes del código
export default Paciente;
