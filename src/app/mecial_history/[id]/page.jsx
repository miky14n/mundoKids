"use client";

import CardPatient from "@/components/CardPatient";
import { useState, useEffect } from "react";
import {
  combineDataAppoimnet,
  fetchAppointments,
  fetchServices,
  fetchMedicalServices,
  combineDataMedicalSrv,
} from "./functionsForOne";
import BasicTable from "@/components/BasicTable";

export default function OnePatient({ params }) {
  let ci = params.id;
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState(null);
  const [servicesOnePatient, setServicesOnePatient] = useState([]);
  const [appoimentOnePatient, setAppoimentOnePatient] = useState([]);
  const [lastServices, setLastServices] = useState([]);
  const [lastAppointments, setLastAppointments] = useState([]);
  useEffect(() => {
    if (ci && ci.trim() !== "") {
      const fetchPatient = async () => {
        try {
          console.log("Buscando paciente con CI:", ci);
          const response = await fetch(`/api/patients/${ci}`);
          if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status}`);
          }

          const data = await response.json();
          const appoimentPatient = await fetchAppointments(ci);
          const servicesPatient = await fetchMedicalServices(
            data[0].patient_id
          );

          if (!data || data.length === 0) {
            throw new Error("No se encontraron datos para este paciente.");
          }

          console.log("Datos del paciente:", data);
          setPatient(data);
          const appoimentCombine = await combineDataAppoimnet(appoimentPatient);
          //console.log("La respuesta de la convinacion", app);
          setAppoimentOnePatient(appoimentCombine);
          const servicesCombine = await combineDataMedicalSrv(servicesPatient);
          setServicesOnePatient(servicesCombine);
          if (servicesPatient.length > 0) {
            setLastServices(servicesPatient.at(-1));
          }

          if (appoimentPatient.length > 0) {
            setLastAppointments(appoimentPatient.at(-1));
          }
        } catch (err) {
          console.error("Error al buscar al paciente:", err);
          setError(err.message);
        }
      };

      fetchPatient();
    } else {
      setError("CI del paciente no válido.");
    }
  }, [ci]);

  if (error) {
    return (
      <div className="text-center mt-8">
        <p className="text-red-600 font-semibold">Error: {error}</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center mt-8">
        <p className="text-blue-600 font-semibold">
          Cargando datos del paciente...
        </p>
      </div>
    );
  }
  let columsAppoimentShow = [
    "Tipo de consulta",
    "Fecha de la consulta",
    "Altura",
    "Peso",
    "Temperatura",
    "Responsable",
    "Nombre del Doctor",
    "Especialidad",
  ];
  let columsMedicalSrvShow = [
    "Nombre del servicio medico",
    "Fecha del ultimo servicio medico",
    "Altura",
    "Peso",
    "Temperatura",
    "Responsable",
  ];
  return (
    <>
      {patient ? (
        <>
          {patient && (
            <>
              {console.log("El paciente:", appoimentOnePatient)}
              <CardPatient data={patient} />
              <hr className=" my-6" />
              <div>
                <BasicTable
                  data={appoimentOnePatient}
                  title={"Ultima Cita medica"}
                  personalColums={columsAppoimentShow}
                />
              </div>
              <div>
                <BasicTable
                  data={servicesOnePatient}
                  title={"Ultima Servicios medicos Aplicados"}
                  personalColums={columsMedicalSrvShow}
                />
              </div>
            </>
          )}
        </>
      ) : (
        <div className="text-center mt-8">
          <p className="text-blue-600 font-semibold">
            Cargando datos del paciente...
          </p>
        </div>
      )}
    </>
  );
}
