import { myQueryJson } from "@/influxdb"

export default async function handler(req, res) {

  const {hours, npool, sensor} = req.query

  const getInfo = await myQueryJson(hours,npool,sensor)
  console.log(getInfo)

  res.status(200).json(getInfo)

}