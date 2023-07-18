import { obtenerSensor } from "@/mongo"

export default async function handler(req, res) {

    const { idPool, idSensor } = req.query

    const getSensor = await obtenerSensor(idPool, idSensor)

    console.log(getSensor, idPool, idSensor)

    res.status(200).json(getSensor)

}