import Chart from '@/component/Chart';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

import { useState, useEffect } from 'react';

export default function Home() {

  const [generalData, setGeneralData] = useState("")
  const [sensorData, setSensorData] = useState("")
  const [loading, setLoading] = useState(true)
  const [pool, setPool] = useState(1)
  const [sensorInfo, setSensorInfo] = useState([])

  const getPool = async () => {
    setLoading(true)
    const response = await fetch("api/getPiscinas/" + pool)
    const data = await response.json()
    setGeneralData(data)
    setLoading(false)
  }

  const handleButton = async (id) => {
    setLoading(true)
    const response = await fetch("api/getSensor/" + pool + "/" + id)
    const data = await response.json()
    setSensorData(data)
    const responseSensor = await fetch("api/infoSensor/24/" + pool + "/" + id)
    const info = await responseSensor.json()
    setSensorInfo(info)

    const datosActualizados = sensorInfo.map((objeto) => {
      const fechaActual = new Date(objeto.time);

      const opciones = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

      //console.log(fechaActual.toLocaleDateString('de-DE', opciones));
      return { ...objeto, time: fechaActual.toLocaleDateString('cl-CL', opciones) };
    });

    console.log(datosActualizados)
    setLoading(false)
  }

  useEffect(() => {
    getPool()
  }, [pool])

  if (loading === false) {
    return (
      <div className='flex flex-col justify-center w-full'>
        <div>

        </div>
        <h1 className='text-center text-4xl font-bold mt-5'>Piscinas no-SQL</h1>

        <select value={pool} className=' w-fit p-2 mx-auto my-4 border-2 border-black rounded-lg' onChange={(e) => setPool(e.target.value)}>
          <option value="1">Piscina 1</option>
          <option value="2">Piscina 2</option>
          <option value="3">Piscina 3</option>
          <option value="4">Piscina 4</option>
          <option value="5">Piscina 5</option>
        </select>

        <div className='my-4 mx-auto shadow-lg border-2 rounded-3xl bg-blue-500 border-black w-80 md:w-1/2 h-72 grid grid-cols-2'>
          <button className='m-2 bg-blue-300 p-3 rounded-lg shadow-lg w-fit h-fit' onClick={() => handleButton(1)}>Sensor 1</button>
          <button className='m-2 bg-blue-300 p-3 rounded-lg shadow-lg w-fit h-fit justify-self-end' onClick={() => handleButton(2)}>Sensor 2</button>
          <button className='m-2 bg-blue-300 p-3 rounded-lg shadow-lg w-fit h-fit self-end' onClick={() => handleButton(3)}>Sensor 3</button>
          <button className='m-2 bg-blue-300 p-3 rounded-lg shadow-lg w-fit h-fit justify-self-end self-end' onClick={() => handleButton(4)}>Sensor 4</button>
        </div>

        <div className="grid md:grid-cols-2 mx-auto gap-4">
          <div>
            <h1 className='text-center text-xl font-semibold'>Informacion piscina:</h1>
            <h1>ID: {generalData.piscina}</h1>
            <h1>Descripcion: {generalData.descripcion}</h1>
            <h1>Cantidad de sensores: {generalData.sensores.length}</h1>
          </div>
          <div>
            <h1 className='text-center text-xl font-semibold'>Informacion sensor seleccionado:</h1>

            {
              sensorData === "" ? (
                <h1>Seleccione un sensor</h1>
              ) : (
                <>
                  <h1>ID: {sensorData.sensor}</h1>
                  <h1>Marca: {sensorData.marca}</h1>
                  <h1>Tipo: {sensorData.tipo}</h1>
                  <h1>Modelo: {sensorData.modelo}</h1>
                </>
              )
            }
          </div>
        </div>
        <div className='my-4'>
          <h1 className='text-center text-xl font-semibold'>Historial 24 horas</h1>
          <div className='flex justify-center'>
            <Chart data={sensorInfo} />
          </div>
          <table className="w-[300px] md:w-2/3 text-sm text-left mx-auto">
            <thead className="text-xs text-gray-700 uppercase bg-blue-200">
              <tr>
                <th className='p-2'>Tiempo</th>
                <th className='p-2'>Temperatura</th>
              </tr>
            </thead>
            <tbody>
              {
                sensorInfo.map((x) => (
                  <tr>
                    <th>{x.time}</th>
                    <th>{x.value}</th>
                  </tr>
                ))
              }

            </tbody>
          </table>
        </div>
      </div>
    )
  }
  return (
    <div>
      <h1>Cargando...</h1>
    </div>
  )
}
