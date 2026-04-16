"use client";
import BasicForm from "@/components/BasicForm";
import SimpleInput from "@/components/Input";
import Alert from "@/components/Alert";
import { useEffect, useState } from "react";
import { fetchPatients } from "./functions";

function IconSearch(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export default function MedicalHistory() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [ci, setCi] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const patients = await fetchPatients();
        setData(patients);
        setFilteredData(patients);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        setError("No se pudo cargar la lista de pacientes");
      } finally {
        setLoading(false);
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
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Historial clínico</h2>
          <p className="page-subtitle">
            Busca pacientes por nombre o por carnet de identidad.
          </p>
        </div>
        <div className="pill bg-brand-50 text-brand-700 ring-1 ring-brand-100">
          {filteredData.length} resultados
        </div>
      </div>

      <div className="surface-card mb-6 p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2 text-ink-muted">
          <IconSearch className="h-4 w-4" />
          <p className="text-sm font-medium">Filtrar pacientes</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SimpleInput
            label="Nombre del paciente"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <SimpleInput
            label="CI del paciente"
            value={ci}
            onChange={(e) => setCi(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <Alert message={error} color="danger" setStatus={() => setError(null)} />
      )}

      {loading ? (
        <div className="surface-card flex items-center justify-center p-10 text-sm text-ink-soft">
          Cargando pacientes...
        </div>
      ) : filteredData.length === 0 ? (
        <div className="surface-card p-10 text-center">
          <p className="text-sm font-medium text-ink">Sin resultados</p>
          <p className="mt-1 text-xs text-ink-soft">
            Prueba con otro nombre o CI.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredData.map((patient, index) => (
            <BasicForm
              key={patient.patient_id || index}
              formTitle={`${patient.name} ${patient.last_name}`}
              layout="horizontal"
              fields={[
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
                      ? new Date(patient.date_of_birth).toLocaleDateString(
                          "es-ES"
                        )
                      : "—",
                },
              ]}
              buttonLabel="Ver detalle"
              navigationTo={`/medical-history/${patient.patient_id}`}
              colorButton="primary"
            />
          ))}
        </div>
      )}
    </div>
  );
}
