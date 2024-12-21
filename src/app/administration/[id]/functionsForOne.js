const fetchAppointments = async (ci) => {
  try {
    const response = await fetch(`/api/appointment?id=${ci}`, {
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

const fetchServices = async (patient_id) => {
  try {
    const response = await fetch(`/api/medical_services?id=${patient_id}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Error al obtener los datos: ${response.status}`);
    }
    const data = await response.json();
    console.log("Datos de los servicios médicos:", data);
    return data; // Retorna los datos de la API
  } catch (error) {
    console.error("Error al buscar los servicios médicos:", error);
    throw error; // Lanza el error para manejarlo externamente
  }
};

export { fetchAppointments, fetchServices };
