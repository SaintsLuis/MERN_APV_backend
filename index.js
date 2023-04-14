// Importamos los módulos express, dotenv y cors
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import conectarDB from './config/db.js'; // Importamos la función conectarDB desde el archivo db.js
import veterinarioRoutes from './routes/veterinarioRoutes.js'; // Routes |
import pacienteRoutes from './routes/pacienteRoutes.js'; // Routes |

// Inicializamos nuestra app express
const app = express();
app.use(express.json());

// Cargamos las variables de entorno definidas en el archivo .env
dotenv.config();

// Conectamos nuestra app a la base de datos
conectarDB();

// cors
const dominiosPermitidos = [process.env.FRONTEND_URL]; // dominio del frontend
const corsOptions = {
    origin: function (origin, callback) {
        if (dominiosPermitidos.indexOf(origin) !== -1) {
            // El Origien del Request esta permitido
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
};

app.use(cors(corsOptions));

// Creamos los endpoints Raiz de nuestra API | veterinarioRoutes & pacienteRoutes
app.use('/api/veterinarios', veterinarioRoutes);
app.use('/api/pacientes', pacienteRoutes);

// Definimos el puerto donde se ejecutará nuestro servidor(backend)
const PORT = process.env.PORT || 4000;

// Iniciamos el servidor y nos muestra un mensaje en la consola cuando esté listo
app.listen(PORT, () => {
    console.log(`Servidor Funcionando en el puerto ${PORT}`);
});
