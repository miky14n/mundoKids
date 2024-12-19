"use client";
import BasicForm from "@/components/BasicForm";
import SimpleInput from "@/components/Input";
import { useEffect, useState } from "react";
import { fetchPatients } from "./functions";

export default function Administracion() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const patients = await fetchPatients();
        setData(patients);
        console.log("Pacientes cargados:", patients);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        setError("No se pudo cargar la lista de pacientes");
      }
    };

    loadData();
  }, []);

  const fields = [
    {
      name: "info",
      type: "text-only",
      title: "Información Importante:",
      label: "Este formulario debe llenarse con datos reales.",
    },
  ];

  return (
    <div>
      <h1>Administración de Pacientes</h1>
      <SimpleInput label="Nombre de paciente" />
      <SimpleInput label="Ingrese CI del paciente" />

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {data.length > 0 ? (
            data.map((patient, index) => (
              <div key={index} className="my-4 p-4 border rounded">
                <BasicForm
                  formTitle="Datos de paciente"
                  layout="horizontal"
                  fields={[
                    {
                      name: "name",
                      type: "text-only",
                      title: "Nombre del paciente",
                      label: `${patient.name} ${patient.last_name}`,
                    },
                    {
                      name: "ci",
                      type: "text-only",
                      title: "CI",
                      label: patient.ci,
                    },
                    {
                      name: "yearsOld",
                      type: "text-only",
                      title: "Edad",
                      label: patient.age,
                    },
                    {
                      name: "gender",
                      type: "text-only",
                      title: "Género",
                      label: patient.gender,
                    },
                    {
                      name: "dateBorn",
                      type: "text-only",
                      title: "Fecha de nacimiento",
                      label:
                        typeof patient.date_of_birth === "string"
                          ? patient.date_of_birth.split("T")[0]
                          : "Fecha no disponible",
                    },
                  ]}
                  buttonLabel="Ver detalle."
                />
              </div>
            ))
          ) : (
            <p>No hay pacientes registrados.</p>
          )}
        </>
      )}
    </div>
  );
}
