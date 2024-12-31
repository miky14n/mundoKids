"use client";

import Alert from "@/components/Alert";
import { useState, useEffect } from "react";
import BasicForm from "@/components/BasicForm";

export default function Noursing() {
  const [appoiments, setAppoiments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApiAppoiment();
  }, []);

  const fetchApiAppoiment = async () => {
    try {
      const today = new Date();
      const date = `${today.getFullYear()}-${(today.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
      let checker = false;
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
                `/api/patients/${appointment.ci}`
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
          } else {
            console.log("No hay datos por completar");
            checker = true;
          }
        })
      );

      const filteredAppointments = updatedAppointments.filter(Boolean);
      setAppoiments(filteredAppointments);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      {error && <Alert message={`Error: ${error}`} type="error" />}
      <div className="mt-8 ">
        {appoiments.length > 0 ? (
          appoiments
            .filter((item) => !item.height && !item.weight && !item.temperature)
            .map((item, index) => (
              <div key={index} className="mt-16">
                <hr className="border-t-2 border-gray-300 my-6" />
                <BasicForm
                  layout="horizontal"
                  fields={[
                    {
                      name: "temperature",
                      type: "text",
                      label: "Ingrese la temperatura",
                    },
                    { name: "weight", type: "text", label: "Ingrese el peso" },
                    {
                      name: "height",
                      type: "text",
                      label: "Ingrese la altura",
                    },
                  ]}
                  apiUrl={`/api/appointment/${item.appoiment_id}`}
                  typeRequestApi="PATCH"
                  formTitle={`Paciente: ${item.patientName} ${item.patientLastName}`}
                  onSuccessMessage="Registro completado"
                  onErrorMessage="Error al registrar el peso, talla y temperatura"
                  buttonLabel="Registrar."
                  colorButton="secondary"
                  onSuccess={fetchApiAppoiment}
                />
              </div>
            ))
        ) : (
          <Alert
            message={"No hay pacientes agendados para consulta medica"}
            color="error"
          />
        )}
      </div>
    </>
  );
}
