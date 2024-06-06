import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "../../assets/css/spinner.css";
const ChartComponent = ({ info }) => {
  //Spinner
  const [downloading, setDownloading] = useState(true);
  const [datos, setDatos] = useState([]);
  const [max, setMax] = useState(0);
  useEffect(() => {
    setDatos(info);
    setDownloading(false)
    const maxi = Math.max(...info);
    setMax(maxi);
  }, [info]);


  // Define los datos para el gráfico de asistencia vs tiempo
  const ejemplos = max + 10;
  const data = {
    labels: [
      "5 AM",
      "6 AM",
      "7 AM",
      "8 AM",
      "9 AM",
      "10 AM",
      "11 AM",
      "12 PM",
      "1 PM",
      "2 PM",
      "3 PM",
      "4 PM ",
      "5 PM",
      "6 PM",
      "7 PM",
      "8 PM",
    ],
    datasets: [
      {
        label: "Asistencia ",
        data: datos, // Datos de asistencia
        backgroundColor: "#0a6fba", // Color de fondo de las barras
        borderColor: "#0a6fba", // Color del borde de las barras
        borderWidth: 4, // Ancho del borde
      },
    ],
  };

  // Configuración del gráfico de barras
  const options = {
    scales: {
      x: {
        type: "category", // Usa 'category' para las etiquetas del eje x en un gráfico de barras
        title: {
          display: true,
          text: "Horas",
        },
      },
      y: {
        display: false,
        beginAtZero: true,
        suggestedMax: max, // Establece un valor máximo para el eje y
        title: {
          display: true,
          text: "Asistentes",
        },
      },
    },
  };

  return (
    <>
      {downloading  && (
        <div className="overlay">
          <div className="spinner " aria-hidden="true"></div>
        </div>
      )}
      <div>
        <Bar data={data} options={options} />
      </div>
    </>
  );
};

export default ChartComponent;
