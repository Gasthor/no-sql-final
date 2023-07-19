const { InfluxDB, Point } = require('@influxdata/influxdb-client');

const url = 'https://us-east-1-1.aws.cloud2.influxdata.com';
const token = 'rCMqe2m9bF5ybfxthNCgeZKU2zLcNoOUOyRLEYA9NOAh6eV5G1TmZ-jofnbrOAFB4K5K83KcIKggxBU4CYOUog==';
const org = 'Jean'; // Nombre de la organización
const bucket = 'BucketFinal'; // Nombre del bucket

const client = new InfluxDB({ url, token });
const writeClient = client.getWriteApi(org, bucket, 'ns');
const queryClient = client.getQueryApi(org);


/////////////////// GET
export const myQueryJson = async (nHours, pool, sensorNumber) => {
  const fluxQuery = `from(bucket:"BucketFinal") |> range(start: -${nHours}h) |> filter(fn: (r) => r._measurement == "temperature" and r.pool == "${pool}" and r.sensorNumber == "${sensorNumber}")`;
  const result = [];

  for await (const { values, tableMeta } of queryClient.iterateRows(fluxQuery)) {
    const o = tableMeta.toObject(values);
    const data = {
      time: o._time,
      measurement: o._measurement,
      pool: o.pool,
      sensorNumber: o.sensorNumber,
      value: o._value
    };

    result.push(data);
  }

  return result;
};

///// POST


async function insertTemperaturePoint(pool, sensorNumber, value) {
  const point = new Point('temperature')
    .tag('pool', pool)
    .tag('sensorNumber', sensorNumber)
    .intField('value', value);

  try {
    await writeClient.writePoint(point);
    await writeClient.flush();
    console.log('Data inserted successfully.');
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}

/*
router.post('/', (req, res) => {
  const pool = req.body.pool;
  const sensorNumber = req.body.sensorNumber;
  const value = req.body.value;
  console.log("pool: " + pool + " , sensorNumber: " + sensorNumber + " , value " + value);
  insertTemperaturePoint(pool, sensorNumber, value)
    .then((jsonData) => {
      res.json(jsonData);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Internal Server Error' });
    });
});
*/
