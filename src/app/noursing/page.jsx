"use client";
import SimpleInput from "@/components/Input";
import PersonalButton from "@/components/Button";
import Alert from "@/components/Alert";
import { useState, useEffect } from "react";
import BasicForm from "@/components/BasicForm";

export default function Noursing() {
  const [appoiments, setAppoiments] = useState([]); // Inicializar como arreglo vacío
  const [error, setError] = useState(null); // Manejo de errores

  useEffect(() => {
    // Llamar a la API para obtener las citas al montar el componente
    fetchApiAppoiment();
  }, []);

  const fetchApiAppoiment = async () => {
    try {
      const response = await fetch("/api/appointment", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Error fetching data");
      }
      const data = await response.json();

      // Para cada cita, obtener información del paciente
      const updatedAppointments = await Promise.all(
        data.map(async (appointment) => {
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
        })
      );

      setAppoiments(updatedAppointments);
      console.log("Citas médicas actualizadas:", updatedAppointments);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div>Hola perrio</div>
      {error && <Alert message={`Error: ${error}`} type="error" />}
      <div className="mb-8">
        {appoiments
          .filter((item) => !item.height && !item.weight && !item.temperature)
          .map((item, index) => (
            <div key={index} className="mb-8">
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
              />
              <div className="p-4 border border-gray-300 rounded"></div>
            </div>
          ))}
      </div>
    </>
  );
}
