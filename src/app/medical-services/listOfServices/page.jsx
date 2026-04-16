"use client";
import Alert from "@/components/Alert";
import BasicTable from "@/components/Tables/BasicTable";
import { useEffect, useState } from "react";

export default function ListOfServices() {
  const [services, setServices] = useState([]);
  const [specialty, setSpecialty] = useState([]);
  const [showSpecialty, setShowSpecialty] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOneServices();
    fetchSpecialty();
  }, []);

  const fetchOneServices = async () => {
    try {
      const response = await fetch(`/api/services`, { method: "GET" });
      if (!response.ok) throw new Error("Error fetching data");
      setServices(await response.json());
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchSpecialty = async () => {
    try {
      const response = await fetch(`/api/specialty`, { method: "GET" });
      if (!response.ok) throw new Error("Error fetching data");
      setSpecialty(await response.json());
    } catch (err) {
      setError(err.message);
    }
  };

  const columsShow = ["name", "description", "price"];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Lista de servicios</h2>
          <p className="page-subtitle">
            Catálogo de especialidades y servicios médicos de la clínica.
          </p>
        </div>
      </div>

      {error && (
        <Alert
          message={`Error: ${error}`}
          color="danger"
          setStatus={() => setError(null)}
        />
      )}

      <div className="surface-card mb-5 p-2">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setShowSpecialty(true)}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              showSpecialty
                ? "bg-brand-600 text-white shadow-soft"
                : "text-ink-muted hover:bg-slate-50"
            }`}
          >
            Especialidades ({specialty.length})
          </button>
          <button
            type="button"
            onClick={() => setShowSpecialty(false)}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              !showSpecialty
                ? "bg-brand-600 text-white shadow-soft"
                : "text-ink-muted hover:bg-slate-50"
            }`}
          >
            Servicios médicos ({services.length})
          </button>
        </div>
      </div>

      <BasicTable
        data={showSpecialty ? specialty : services}
        personalColums={columsShow}
        rowsPerPage={10}
      />
    </div>
  );
}
