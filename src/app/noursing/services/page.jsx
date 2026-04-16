"use client";

import Alert from "@/components/Alert";
import { useState, useEffect } from "react";
import BasicForm from "@/components/BasicForm";

export default function NoursingServices() {
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApiMedicalSrv();
  }, []);

  const fetchApiMedicalSrv = async () => {
    try {
      setLoading(true);
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
      const updatedServices = await Promise.all(
        data.map(async (service) => {
          if (!service.weight && !service.height && !service.temperature) {
            try {
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
              };
            } catch {
              return {
                ...service,
                patientName: "No disponible",
                patientLastName: "",
              };
            }
          }
          return null;
        })
      );
      setServices(updatedServices.filter(Boolean));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const pendingServices = services.filter(
    (item) =>
      !item.height && !item.weight && !item.temperature && !item.status
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
          Cargando servicios...
        </div>
      ) : pendingServices.length === 0 ? (
        <div className="surface-card p-10 text-center">
          <p className="text-sm font-medium text-ink">
            No hay servicios médicos por atender
          </p>
          <p className="mt-1 text-xs text-ink-soft">
            Cuando haya nuevos servicios pendientes, aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {pendingServices.map((item, index) => (
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
              buttonLabel="Registrar"
              colorButton="primary"
              onSuccess={fetchApiMedicalSrv}
            />
          ))}
        </div>
      )}
    </>
  );
}
