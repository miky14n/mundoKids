const fetchPatients = async () => {
  try {
    const response = await fetch(`/api/patients`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Error al obtener los datos: ${response.status}`);
    }
    const data = await response.json();
    console.log("Datos del paciente:", data);
    return data; // Retorna los datos de la API
  } catch (error) {
    console.error("Error al buscar al paciente:", error);
    throw error; // Lanza el error para manejarlo externamente
  }
};

const fetchAppointments = async () => {
  try {
    const response = await fetch(`/api/appointment`, {
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

const fetchServices = async () => {
  try {
    const response = await fetch(`/api/medical_services`, {
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
const fetchPatient = async (ci) => {
  try {
    console.log(ci);
    const response = await fetch(`/api/patients/2`);
    if (!response.ok) {
      throw new Error(`Error al obtener los datos: ${response.status}`);
    }
    const data = await response.json();
    console.log("Datos del paciente:", data);
    return data; // Retorna los datos de la API
  } catch (error) {
    console.error("Error al buscar al paciente:", error);
    throw error; // Lanza el error para manejarlo externamente
  }
};
export { fetchAppointments, fetchPatients, fetchServices, fetchPatient };
