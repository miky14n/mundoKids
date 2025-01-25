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

export { fetchPatients };
