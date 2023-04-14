/**Este código exporta una función llamada "generarId" que genera un identificador único por cada llamada a esta función. */

const generarId = () => {
    return Date.now().toString(32) + Math.random().toString(32).substring(2);
};

export default generarId;
