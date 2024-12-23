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
    throw error;
  }
};

const fetchMedicalServices = async (patient_id) => {
  try {
    const response = await fetch(`/api/medical_services?id=${patient_id}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Error al obtener los datos: ${response.status}`);
    }
    const data = await response.json();
    console.log("Datos de los servicios médicos:", data);
    return data;
  } catch (error) {
    console.error("Error al buscar los servicios médicos:", error);
    throw error;
  }
};
const fetchSpeciality = async (specialty_id) => {
  try {
    const response = await fetch(`/api/specialty/${specialty_id}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Error al obtener los datos: ${response.status}`);
    }
    const data = await response.json();
    console.log("Datos del medico no encontrado:", data);
    return data;
  } catch (error) {
    console.error("Error al buscar los servicios médicos:", error);
    throw error;
  }
};
const fetchServices = async (services_id) => {
  try {
    const response = await fetch(`/api/services/${services_id}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Error al obtener los datos: ${response.status}`);
    }
    const data = await response.json();
    console.log("Datos del medico no encontrado:", data);
    return data;
  } catch (error) {
    console.error("Error al buscar los servicios médicos:", error);
    throw error;
  }
};
const fetchDoctor = async (doctor_id) => {
  try {
    const response = await fetch(`/api/doctor/${doctor_id}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Error al obtener los datos: ${response.status}`);
    }
    const data = await response.json();
    console.log("Datos del medico no encontrado:", data);
    return data;
  } catch (error) {
    console.error("Error al buscar los servicios médicos:", error);
    throw error;
  }
};
function castColumns(columns) {
  return columns.map((item) => {
    switch (item) {
      case "type_of_appointment":
        return "Tipo de consulta";
      case "doctor_name":
        return "Nombre del Doctor";
      case "date_srv":
        return "Fecha del ultimo servicio medico";
      case "date_appt":
        return "Fecha de la consulta";
      case "height":
        return "Altura";
      case "weight":
        return "Peso";
      case "temperature":
        return "Temperatura";
      case "responsible":
        return "Responsable";
      case "name_medical_srv":
        return "Nombre del servicio medico";

      default:
        return item; // Si no hay traducción, retorna el nombre original
    }
  });
}

const combineDataAppoimnet = async (data) => {
  const results = await Promise.all(
    data.map(async (item) => {
      const doctor = await fetchDoctor(item.doctor_id);
      const specialty = await fetchSpeciality(item.specialty_id);
      const specialtyName = specialty[0].name;
      const doctorName = doctor[0].name;

      return {
        ...item,
        id: item.appoiment_id,
        doctor_name: doctorName,
        Especialidad: specialtyName,
        date_appt: new Date(item.date).toLocaleDateString(),
      };
    })
  );
  const renamedResults = results.map((item) => {
    const renamedItem = {};
    Object.keys(item).forEach((key) => {
      const translatedKey = castColumns([key])[0];
      renamedItem[translatedKey] = item[key];
    });
    return renamedItem;
  });
  //console.log(renamedResults, "Los resultados con columnas traducidas");
  return renamedResults;
};

const combineDataMedicalSrv = async (data) => {
  const results = await Promise.all(
    data.map(async (item) => {
      const services = await fetchServices(item.services_id);
      const servicesName = services[0].name;

      return {
        ...item,
        id: item.medical_srv_id,
        name_medical_srv: servicesName,
        date_srv: new Date(item.data).toLocaleDateString(),
      };
    })
  );
  const renamedResults = results.map((item) => {
    const renamedItem = {};
    Object.keys(item).forEach((key) => {
      const translatedKey = castColumns([key])[0];
      renamedItem[translatedKey] = item[key];
    });
    return renamedItem;
  });
  //console.log(renamedResults, "Los resultados con columnas traducidas");
  return renamedResults;
};

export {
  fetchAppointments,
  fetchServices,
  fetchMedicalServices,
  combineDataAppoimnet,
  combineDataMedicalSrv,
};
