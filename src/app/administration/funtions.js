import {
  fetchDoctor,
  fetchSpeciality,
  castColumns,
  fetchOneServices,
} from "../medical-history/[id]/functionsForOne";
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
    return data;
  } catch (error) {
    console.error("Error al buscar la cita médica:", error);
    throw error;
  }
};
const fetchMedicalServices = async (aditionalQuery) => {
  try {
    const response = await fetch(`/api/medical_services?${aditionalQuery}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Error al obtener los datos: ${response.status}`);
    }
    const data = await response.json();
    console.log("Datos del servico no encontrado:", data);
    return data;
  } catch (error) {
    console.error("Error al buscar los servicios médicos:", error);
    throw error;
  }
};

const processDataServices = async (data, filterName) => {
  if (data.length > 0) {
    const statsMap = new Map();
    await Promise.all(
      data.map(async (item) => {
        const services = await fetchOneServices(item.services_id);
        const servicesCost = parseFloat(services[0].price) || 0;
        if (!services || !servicesCost) {
          console.error(
            `No se pudo obtener el precio para services_id: ${item.services_id}`
          );
          return;
        }
        const key = `${item.services_id}`;

        if (!statsMap.has(key)) {
          statsMap.set(key, {
            services_id: item.services_id,
            services_name: services[0].name,
            total_earnings: 0,
            services_count: 0,
          });
        }

        const currentStats = statsMap.get(key);
        currentStats.total_earnings += servicesCost; // Sumar ganancias
        currentStats.services_count += 1; // Incrementar contador de citas

        statsMap.set(key, currentStats); // Actualizar en el mapa
      })
    );
    const results = Array.from(statsMap.values());
    console.log(results);
    const renamedResults = results.map((item) => {
      const renamedItem = {};
      Object.keys(item).forEach((key) => {
        const translatedKey = castColumns([key], filterName)[0];
        renamedItem[translatedKey] = item[key];
      });
      return renamedItem;
    });

    return renamedResults;
  } else return data;
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

  return renamedResults;
};
const exportToExcel = (data, filterName, fileName = "tabla_medica.xlsx") => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Datos Médicos");

  worksheet.columns = [
    { header: "Especialidad", key: "especialidad", width: 30 },
    { header: "Nombre del Doctor", key: "doctor", width: 30 },
    { header: "Total de Consultas", key: "totalConsultas", width: 20 },
    { header: "Total de Ingreso", key: "totalIngreso", width: 20 },
    {
      header: "Fecha de extracción de reporte",
      key: "fechaExtraccion",
      width: 30,
    },
  ];
  //fecha del dia de exportacion en formato dd/mm/yy
  const currentDate = new Date().toLocaleDateString("es-ES");
  data.forEach((item) => {
    worksheet.addRow({
      especialidad: item.Especialidad,
      doctor: item["Nombre del Doctor"],
      totalConsultas: item[`Total de consultas ${filterName}`],
      totalIngreso: item["Total de ingreso"],
      fechaExtraccion: currentDate,
    });
  });
  const totalIngreso = data.reduce(
    (sum, item) => sum + item["Total de ingreso"],
    0
  );

  // Agregar fila con el total
  const totalRow = worksheet.addRow({
    especialidad: "Total Ingreso",
    totalIngreso: totalIngreso,
  });

  totalRow.getCell("totalIngreso").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFF00" },
  };

  workbook.xlsx
    .writeBuffer()
    .then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName.replace(".xlsx", `_${currentDate}.xlsx`);
      link.click();
    })
    .catch((error) => {
      console.error("Error al generar el archivo Excel:", error);
    });
};

export {
  fetchAppointments,
  processData,
  exportToExcel,
  fetchMedicalServices,
  processDataServices,
};
