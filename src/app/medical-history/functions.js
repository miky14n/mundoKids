const fetchPatients = async () => {
  try {
    const response = await fetch(`/api/patients`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Error al obtener los datos: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al buscar al paciente:", error);
    throw error;
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
    return data;
  } catch (error) {
    console.error("Error al buscar al paciente:", error);
    throw error;
  }
};
export { fetchPatients, fetchPatient };
