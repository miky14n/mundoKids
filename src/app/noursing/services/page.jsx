"use client";

import Alert from "@/components/Alert";
import { useState, useEffect } from "react";
import BasicForm from "@/components/BasicForm";

export default function Noursing() {
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  useEffect(() => {
    fetchApiMedicalSrv();
  }, []);

  const fetchApiMedicalSrv = async () => {
    try {
      const today = new Date();
      const date = `${today.getFullYear()}-${(today.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
      const response = await fetch(`/api/medical_services?date=${date}`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Error fetching data");
      }
      const data = await response.json();
      let checker = false;
      const updatedServices = await Promise.all(
        data.map(async (service) => {
          if (!service.weight && !service.height && !service.temperature) {
            try {
              console.log(service);
              const patientResponse = await fetch(
                `/api/patients/${service.patient_id}`
              );

              if (!patientResponse.ok) {
                throw new Error(
                  `Error al obtener datos del paciente con ID ${service.patient_id}`
                );
              }
              const patientData = await patientResponse.json();

              return {
                ...service,
                patientName: patientData[0]?.name || "No disponible",
                patientLastName: patientData[0]?.last_name || "",
                data: patientData,
              };
            } catch {
              return {
                ...service,
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

      const filterServices = updatedServices.filter(Boolean);
      setServices(filterServices);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      {error && (
        <Alert
          message={`Error: ${error}`}
          type="error"
          setStatus={() => setError(null)}
        />
      )}

      {services.length > 0 ? (
        services
          .filter(
            (item) =>
              !item.height && !item.weight && !item.temperature && !item.status
          )
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
                  {
                    name: "status",
                    type: "checkbox",
                    label: "Servicio completado",
                  },
                ]}
                apiUrl={`/api/medical_services/${item.medical_srv_id}`}
                typeRequestApi="PATCH"
                formTitle={`Paciente: ${item.patientName} ${item.patientLastName}`}
                onSuccessMessage="Registro completado"
                onErrorMessage="Error al registrar el peso, talla y temperatura"
                buttonLabel="Registrar."
                colorButton="secondary"
                onSuccess={fetchApiMedicalSrv}
              />
            </div>
          ))
      ) : (
        <Alert message={"No hay servicios médicos registrados"} color="error" />
      )}
    </>
  );
}
