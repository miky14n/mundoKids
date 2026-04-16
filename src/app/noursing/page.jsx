"use client";

import Alert from "@/components/Alert";
import { useState, useEffect } from "react";
import BasicForm from "@/components/BasicForm";

export default function Noursing() {
  const [appoiments, setAppoiments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApiAppoiment();
  }, []);

  const fetchApiAppoiment = async () => {
    try {
      setLoading(true);
      const today = new Date();
      const date = `${today.getFullYear()}-${(today.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
      const response = await fetch(`/api/appointment?date=${date}`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Error fetching data");
      }
      const data = await response.json();
      const updatedAppointments = await Promise.all(
        data.map(async (appointment) => {
          if (
            !appointment.weight &&
            !appointment.height &&
            !appointment.temperature
          ) {
            try {
              const patientResponse = await fetch(
                `/api/patients/${appointment.patient_id}`
              );
              if (!patientResponse.ok) {
                throw new Error(
                  `Error al obtener datos del paciente con ID ${appointment.patient_id}`
                );
              }
              const patientData = await patientResponse.json();
              return {
                ...appointment,
                patientName: patientData[0]?.name || "No disponible",
                patientLastName: patientData[0]?.last_name || "",
              };
            } catch {
              return {
                ...appointment,
                patientName: "No disponible",
                patientLastName: "",
              };
            }
          }
          return null;
        })
      );
      setAppoiments(updatedAppointments.filter(Boolean));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const pendingAppointments = appoiments.filter(
    (item) => !item.height && !item.weight && !item.temperature
  );

  return (
    <>
      {error && (
        <Alert
          message={`Error: ${error}`}
          color="danger"
          setStatus={() => setError(null)}
        />
      )}
      {loading ? (
        <div className="surface-card flex items-center justify-center p-10 text-sm text-ink-soft">
          Cargando consultas...
        </div>
      ) : pendingAppointments.length === 0 ? (
        <div className="surface-card p-10 text-center">
          <p className="text-sm font-medium text-ink">
            No hay pacientes agendados para consulta médica
          </p>
          <p className="mt-1 text-xs text-ink-soft">
            Cuando lleguen nuevas consultas, aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {pendingAppointments.map((item, index) => (
            <BasicForm
              key={index}
              layout="horizontal"
              fields={[
                {
                  name: "temperature",
                  type: "text",
                  label: "Ingrese la temperatura",
                },
                { name: "weight", type: "text", label: "Ingrese el peso" },
                { name: "height", type: "text", label: "Ingrese la altura" },
              ]}
              apiUrl={`/api/appointment/${item.appoiment_id}`}
              typeRequestApi="PATCH"
              formTitle={`Paciente: ${item.patientName} ${item.patientLastName}`}
              onSuccessMessage="Registro completado"
              onErrorMessage="Error al registrar el peso, talla y temperatura"
              buttonLabel="Registrar"
              colorButton="primary"
              onSuccess={fetchApiAppoiment}
            />
          ))}
        </div>
      )}
    </>
  );
}
