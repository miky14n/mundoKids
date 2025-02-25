const fetchAppointments = async (ci) => {
  try {
    const response = await fetch(`/api/appointment?id=${ci}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Error al obtener los datos: ${response.status}`);
    }
    const data = await response.json();

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
    return data;
  } catch (error) {
    console.error("Error al buscar los servicios médicos:", error);
    throw error;
  }
};
const fetchOneServices = async (services_id) => {
  try {
    const response = await fetch(`/api/services/${services_id}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Error al obtener los datos: ${response.status}`);
    }
    const data = await response.json();
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
    return data;
  } catch (error) {
    console.error("Error al buscar los médicos:", error);
    throw error;
  }
};
function castColumns(columns, filterName) {
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
      case "specialty_name":
        return "Especialidad";
      case "appointment_count":
        return `Total de consultas ${filterName}`;
      case "services_count":
        return `Total de servicios atendidos ${filterName}`;
      case "services_name":
        return `Nombre del servicio medico`;
      case "total_earnings":
        return "Total de ingreso";
      case "appointment_price":
        return "Costo de la Consulta";
      case "description_of_greement":
        return "Descripcion del convenio";
      case "agreement_percent":
        return "Porcentaje de descuento aplicado";
      case "specialty_price":
        return "Costo de la especialidad";
      case "doctor_full_name":
        return "Nombre del doctor";
      case "gloss":
        return "Glosa de aporte";
      case "date":
        return "Fecha del aporte";
      case "amount_contributed":
        return "Cantidad de aporte";
      case "payment_type":
        return "Tipo de Pago";
      case "service_cost":
        return "Costo del servicio";
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
      const services = await fetchOneServices(item.services_id);
      const servicesName = services[0].name;

      return {
        ...item,
        id: item.medical_srv_id,
        name_medical_srv: servicesName,
        date_srv: new Date(item.date).toLocaleDateString(),
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
const findDoctor = async (doctor) => {
  try {
    const response = await fetch(`/api/doctor?tofind=${doctor}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Error al obtener los datos: ${response.status}`);
    }
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error("Error al buscar los médicos:", error);
    throw error;
  }
};
export {
  findDoctor,
  fetchAppointments,
  fetchOneServices,
  fetchMedicalServices,
  combineDataAppoimnet,
  combineDataMedicalSrv,
  fetchSpeciality,
  fetchDoctor,
  castColumns,
};
