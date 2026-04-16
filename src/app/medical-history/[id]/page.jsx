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
import Alert from "@/components/Alert";

export default function OnePatient({ params }) {
  const { data: session } = useSession();

  const limitAccesse = ["nurse", "doctor", "receptionist"];
  const patient_id = params.id;
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
          setPatient(data);
          const appoimentCombine = await combineDataAppoimnet(appoimentPatient);
          setAppoimentOnePatient(appoimentCombine);
          const servicesCombine = await combineDataMedicalSrv(servicesPatient);
          setServicesOnePatient(servicesCombine);
          if (limitAccesse.includes(session?.user.role)) {
            if (servicesCombine.length > 0) {
              setLastServices(servicesCombine.slice(-2));
            }
            if (appoimentCombine.length > 0) {
              const doctor = await findDoctor(session?.user.email);
              const appoimentFilter = appoimentCombine.filter(
                (appointment) => appointment.doctor_id === doctor.doctor_id
              );
              setLastAppointments(appoimentFilter.slice(-2));
            }
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
      <div className="page-container">
        <Alert message={`Error: ${error}`} color="danger" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="page-container">
        <div className="surface-card flex items-center justify-center p-10 text-sm text-ink-soft">
          Cargando datos del paciente...
        </div>
      </div>
    );
  }

  const columsAppoimentShow = [
    "Tipo de consulta",
    "Fecha de la consulta",
    "Altura",
    "Peso",
    "Temperatura",
    "Responsable",
    "Nombre del Doctor",
    "Especialidad",
  ];
  const columsMedicalSrvShow = [
    "Nombre del servicio medico",
    "Fecha del ultimo servicio medico",
    "Altura",
    "Peso",
    "Temperatura",
    "Responsable",
  ];

  return (
    <div className="page-container">
      <CardPatient data={patient} />

      <section className="mt-8 space-y-8">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="section-title">Últimas consultas médicas</h3>
            <span className="pill bg-brand-50 text-brand-700 ring-1 ring-brand-100">
              Consultas
            </span>
          </div>
          <BasicTable
            data={
              limitAccesse.includes(session?.user.role)
                ? lastAppointments
                : appoimentOnePatient
            }
            personalColums={columsAppoimentShow}
            rowsPerPage={10}
          />
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="section-title">Últimos servicios médicos aplicados</h3>
            <span className="pill bg-accent-50 text-accent-600 ring-1 ring-accent-100">
              Servicios
            </span>
          </div>
          <BasicTable
            data={
              limitAccesse.includes(session?.user.role)
                ? lastServices
                : servicesOnePatient
            }
            personalColums={columsMedicalSrvShow}
            rowsPerPage={10}
          />
        </div>
      </section>
    </div>
  );
}
