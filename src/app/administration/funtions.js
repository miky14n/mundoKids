import {
  fetchDoctor,
  fetchSpeciality,
  castColumns,
} from "../mecial_history/[id]/functionsForOne";
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

const processData = async (data) => {
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

  // Convertimos el mapa en un array
  const results = Array.from(statsMap.values());
  const renamedResults = results.map((item) => {
    const renamedItem = {};
    Object.keys(item).forEach((key) => {
      const translatedKey = castColumns([key])[0];
      renamedItem[translatedKey] = item[key];
    });
    return renamedItem;
  });
  console.log("Datos procesados:", renamedResults);

  return renamedResults;
};

export { fetchAppointments, processData };
