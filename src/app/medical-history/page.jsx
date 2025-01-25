"use client";
import BasicForm from "@/components/BasicForm";
import SimpleInput from "@/components/Input";
import { useEffect, useState } from "react";
import { fetchPatients } from "./functions";

export default function MedicalHistory() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [ci, setCi] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const patients = await fetchPatients();
        setData(patients);
        setFilteredData(patients);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        setError("No se pudo cargar la lista de pacientes");
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const filtered = data.filter((patient) => {
      const matchesName =
        name.trim() === "" ||
        `${patient.name} ${patient.last_name}`
          .toLowerCase()
          .includes(name.toLowerCase());
      const matchesCi = ci.trim() === "" || patient.ci.toString().includes(ci);
      return matchesName && matchesCi;
    });
    setFilteredData(filtered);
  }, [name, ci, data]);

  return (
    <div>
      <div className="grid grid-cols-2 gap-6 mt-4">
        <SimpleInput
          label="Nombre de paciente"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <SimpleInput
          label="Ingrese CI del paciente"
          value={ci}
          onChange={(e) => setCi(e.target.value)}
        />
      </div>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {filteredData.length > 0 ? (
            filteredData.map((patient, index) => (
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
                  navigationTo={`/medical-history/${patient.patient_id}`}
                  colorButton={"secondary"}
                />
              </div>
            ))
          ) : (
            <p>Cargando datos...</p>
          )}
        </>
      )}
    </div>
  );
}
