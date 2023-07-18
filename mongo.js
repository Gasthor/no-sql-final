const mongoose = require("mongoose");

const user = "monitoreo";
const password = "lQjrXHFNRDVjEkyJ";
const dbname = "monitoreo";

const uri = `mongodb+srv://${user}:${password}@cluster0.rx3gogl.mongodb.net/${dbname}?retryWrites=true&w=majority`;

/*Conexion*/
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Base de datos conectada"))
  .catch((e) => console.log(e));

/*Esquema Piscina*/
const piscinaSchema = new mongoose.Schema({
  piscina: Number,
  descripcion: String,
  sensores: [
    {
      sensor: Number,
      marca: String,
      tipo: String,
      modelo: String
    },
    {
      sensor: Number,
      marca: String,
      tipo: String,
      modelo: String
    },
    {
      sensor: Number,
      marca: String,
      tipo: String,
      modelo: String
    },
    {
      sensor: Number,
      marca: String,
      tipo: String,
      modelo: String
    }
  ]
});

/*Modelo piscina*/
const Piscina = mongoose.models.Piscina || mongoose.model("Piscina", piscinaSchema);

/*Get de todas las piscinas
Piscina.find().then((piscinas) => {
      console.log("Piscinas encontradas",piscinas);
  }).catch((error) => {
      console.log("Error: ",error);
  });
*/
/*Get de una piscina*/
export const obtenerPiscina = async (piscinaKey) => {
  try {
    const piscina = await Piscina.findOne({ piscina: piscinaKey });
    return piscina;
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener los datos de la piscina");
  }
}

/*Get de sensor según piscina*/
export const obtenerSensor = async (piscinaKey, sensorKey) => {
  try {
    const piscina = await Piscina.findOne({ piscina: piscinaKey });
    if (!piscina) {
      throw new Error("Piscina no encontrada");
    }

    let y = {}

    piscina.sensores.map((x) => {
      console.log(x.sensor, sensorKey)
      if (parseInt(x.sensor) === parseInt(sensorKey)) {
        console.log("Hola")
        y = x
      }

    })

    return y;
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener el sensor");
  }
}



//obtenerSensor(1, 2).then((sensores) => console.log(sensores)).catch((error) => console.log(error));
