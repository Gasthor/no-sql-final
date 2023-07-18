import { obtenerPiscina } from "@/mongo"

export default async function handler(req, res) {

  const {id} = req.query

  const getPoll = await obtenerPiscina(id)
  console.log(getPoll)

  res.status(200).json(getPoll)
}
