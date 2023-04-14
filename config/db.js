//Importamos el paquete Mongoose
import mongoose from 'mongoose';

//creamos una función asincrona para conectar a la base de datos
const conectarDB = async () => {
    try {
        //usamos el método "connect" de mongoose para establecer la conexión con la base de datos usando la url proporcionada en la variable de entorno "MONGO_URI"
        const db = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        //Obtenemos el host y puerto de la conexión de la base de datos y lo almacenamos en una variable
        const url = `${db.connection.host}: ${db.connection.port}`;
        //Imprimimos un mensaje de que la conexión se ha establecido con éxito, mostrando el host y el puerto en los que se ha establecido la conexión
        console.log(`MongoDB conectado en: ${url}`);
    } catch (error) {
        //Si se produce un error durante la conexión, lo imprimimos y salimos del proceso
        console.log(`error: ${error.message}`);
        process.exit(1);
    }
};

//Exportamos la función conectarDB
export default conectarDB;
