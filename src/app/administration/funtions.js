import {
  fetchDoctor,
  fetchSpeciality,
  castColumns,
} from "../mecial_history/[id]/functionsForOne";
import ExcelJS from "exceljs";

const fetchAppointments = async (aditionalQuery) => {
  try {
    const response = await fetch(`/api/appointment?${aditionalQuery}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Error al obtener los datos: ${response.status}`);
    }
    const data = await response.json();
    console.log("Datos de la cita médica:", data);
    return data; // Retorna los datos de la API
  } catch (error) {
    console.error("Error al buscar la cita médica:", error);
    throw error; // Lanza el error para manejarlo externamente
  }
};

const processData = async (data, filterName) => {
  const statsMap = new Map();

  await Promise.all(
    data.map(async (item) => {
      const specialty = await fetchSpeciality(item.specialty_id);
      const specialtyCost = parseFloat(specialty[0].price) || 0;
      const doctor = await fetchDoctor(item.doctor_id);
      //console.log("Soy el dr:", doctor);
      if (!specialty || !specialtyCost) {
        console.error(
          `No se pudo obtener el precio para specialty_id: ${item.specialty_id}`
        );
        return;
      }
      const key = `${item.doctor_id}-${item.specialty_id}`; // Clave única para doctor y especialidad

      if (!statsMap.has(key)) {
        statsMap.set(key, {
          doctor_id: item.doctor_id,
          specialty_id: item.specialty_id,
          specialty_name: specialty[0].name,
          doctor_name: doctor[0].name,
          total_earnings: 0,
          appointment_count: 0,
        });
      }

      const currentStats = statsMap.get(key);
      currentStats.total_earnings += specialtyCost; // Sumar ganancias
      currentStats.appointment_count += 1; // Incrementar contador de citas

      statsMap.set(key, currentStats); // Actualizar en el mapa
    })
  );
  const results = Array.from(statsMap.values());
  const renamedResults = results.map((item) => {
    const renamedItem = {};
    Object.keys(item).forEach((key) => {
      const translatedKey = castColumns([key], filterName)[0];
      renamedItem[translatedKey] = item[key];
    });
    return renamedItem;
  });
  console.log("Datos procesados:", renamedResults);

  return renamedResults;
};
const exportToExcel = (data, filterName, fileName = "tabla_medica.xlsx") => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Datos Médicos");

  // Agregar los encabezados
  worksheet.columns = [
    { header: "Especialidad", key: "especialidad", width: 30 },
    { header: "Nombre del Doctor", key: "doctor", width: 30 },
    { header: "Total de Consultas", key: "totalConsultas", width: 20 },
    { header: "Total de Ingreso", key: "totalIngreso", width: 20 },
  ];

  // Formatear los datos
  data.forEach((item) => {
    worksheet.addRow({
      especialidad: item.Especialidad,
      doctor: item["Nombre del Doctor"],
      totalConsultas: item[`Total de consultas ${filterName}`],
      totalIngreso: item["Total de ingreso"],
    });
  });

  // Crear un buffer del archivo Excel
  workbook.xlsx
    .writeBuffer()
    .then((buffer) => {
      // Crear un enlace para descargar el archivo
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    })
    .catch((error) => {
      console.error("Error al generar el archivo Excel:", error);
    });
};
export { fetchAppointments, processData, exportToExcel };
