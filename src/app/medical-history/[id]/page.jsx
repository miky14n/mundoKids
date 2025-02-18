"use client";

import CardPatient from "@/components/CardPatient";
import { useState, useEffect } from "react";
import {
  combineDataAppoimnet,
  fetchAppointments,
  fetchMedicalServices,
  combineDataMedicalSrv,
  findDoctor,
} from "./functionsForOne";
import BasicTable from "@/components/Tables/BasicTable";
import { useSession } from "next-auth/react";

export default function OnePatient({ params }) {
  const { data: session } = useSession();

  const limitAccesse = ["nurse", "doctor", "receptionist"];
  let patient_id = params.id;
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState(null);
  const [servicesOnePatient, setServicesOnePatient] = useState([]);
  const [appoimentOnePatient, setAppoimentOnePatient] = useState([]);
  const [lastServices, setLastServices] = useState([]);
  const [lastAppointments, setLastAppointments] = useState([]);
  useEffect(() => {
    if (patient_id && patient_id.trim() !== "") {
      const fetchPatient = async () => {
        try {
          //console.log("Buscando paciente con CI:", ci);
          const response = await fetch(`/api/patients/${patient_id}`);
          if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status}`);
          }

          const data = await response.json();
          const appoimentPatient = await fetchAppointments(patient_id);
          const servicesPatient = await fetchMedicalServices(
            data[0].patient_id
          );

          if (!data || data.length === 0) {
            throw new Error("No se encontraron datos para este paciente.");
          }

          //console.log("Datos del paciente:", data);
          setPatient(data);
          const appoimentCombine = await combineDataAppoimnet(appoimentPatient);
          //console.log("La respuesta de la convinacion", app);
          setAppoimentOnePatient(appoimentCombine);
          const servicesCombine = await combineDataMedicalSrv(servicesPatient);
          setServicesOnePatient(servicesCombine);
          if (limitAccesse.includes(session?.user.role)) {
            if (servicesCombine.length > 0) {
              setLastServices(servicesCombine.slice(-2));
            }

            if (appoimentCombine.length > 0) {
              const doctor = await findDoctor(session?.user.email);
              console.log("El doctore", appoimentCombine);
              const appoimentFilter = appoimentCombine.filter(
                (appointment) => appointment.doctor_id === doctor.doctor_id
              );

              setLastAppointments(appoimentFilter.slice(-2));
            }
          } else {
            console.log("No se detecta el rol", session);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient_id, session]);

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
              <CardPatient data={patient} />
              <hr className=" my-6" />
              <div>
                <BasicTable
                  data={
                    limitAccesse.includes(session?.user.role)
                      ? lastAppointments
                      : appoimentOnePatient
                  }
                  title={"Ultima Cita medica"}
                  personalColums={columsAppoimentShow}
                  rowsPerPage={10}
                />
              </div>
              <div>
                <BasicTable
                  data={
                    limitAccesse.includes(session?.user.role)
                      ? lastServices
                      : servicesOnePatient
                  }
                  title={"Ultima Servicios medicos Aplicados"}
                  personalColums={columsMedicalSrvShow}
                  rowsPerPage={10}
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
