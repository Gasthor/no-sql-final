import { insertTemperaturePoint, myQueryJson } from "@/influxdb"

export default async function handler(req, res) {

  const { hours, npool, sensor } = req.query

  if (req.method === "POST") {

    console.log("pool: " + npool + " , sensorNumber: " + sensor + " , value " + hours);
    insertTemperaturePoint(npool, sensor, hours)
      .then((jsonData) => {
        res.json(jsonData);
      })
      .catch((error) => {
        res.status(500).json({ error: 'Internal Server Error' });
      });

  } else {
    const getInfo = await myQueryJson(hours, npool, sensor)
    console.log(getInfo)

    res.status(200).json(getInfo)
  }




}