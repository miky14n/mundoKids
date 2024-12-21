"use client";

import CardPatient from "@/components/CardPatient";
import { useState, useEffect } from "react";
import { fetchAppointments, fetchServices } from "./functionsForOne";

export default function OnePatient({ params }) {
  let ci = params.id;
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState(null);
  const [servicesOnePatient, setServicesOnePatient] = useState(null);
  const [appoimentOnePatient, setAppoimentOnePatient] = useState(null);
  const [lastServices, setLastServices] = useState(null);
  const [lastAppointments, setLastAppointments] = useState(null);
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
          const servicesPatient = await fetchServices(data[0].patient_id);
          if (Object.keys(data).length === 0) {
            throw new Error("No se encontraron datos para este paciente.");
          }
          console.log("Datos del paciente:", data);
          setPatient(data);
          setAppoimentOnePatient(appoimentPatient);
          setServicesOnePatient(servicesPatient);
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

  return (
    <>
      {patient ? (
        <>
          {patient && <CardPatient data={patient} />}
          {console.log("El paciente:", patient)}
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
