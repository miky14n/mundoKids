"use client";
import BasicTable from "@/components/Tables/BasicTable";
import SimpleInput from "@/components/Input";
import SimpleDropdown from "@/components/SimpleDropdown";
import { useEffect, useState } from "react";
import {
  exportToExcel,
  procesDataForDetailRp,
  fetchReport,
} from "./funtions";
import PersonalButton from "@/components/Button";
import { useSession } from "next-auth/react";
import { iconExcel } from "@/components/Icons";
import Alert from "@/components/Alert";

const VIEWS = [
  { key: "appointments", label: "Reporte médicos" },
  { key: "services", label: "Reporte de servicios" },
  { key: "contributions", label: "Reporte de aportes" },
];

export default function Reports() {
  const [dataReport, setData] = useState([]);
  const [dataReportServices, setDataServices] = useState([]);
  const [dataReportContr, setDataContr] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [doctorName, setDoctorName] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const { data: session } = useSession();
  const [view, setView] = useState("appointments");

  const items =
    session?.user.role === "nurse" || session?.user.role === "receptionist"
      ? [{ key: "today", label: "Dia" }]
      : [
          { key: "today", label: "Dia" },
          { key: "week", label: "Semana" },
          { key: "month", label: "Mes" },
        ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const filter = selectedItem ? selectedItem.key : "today";
        if (view === "services") {
          const medicalServices = await fetchReport(
            `/api/reports/medical-services?filter=${filter}`
          );
          setDataServices(await procesDataForDetailRp(medicalServices));
        } else if (view === "contributions") {
          const contributions = await fetchReport(
            `/api/reports/doctor-contributions?filter=${filter}`
          );
          setDataContr(await procesDataForDetailRp(contributions));
        } else {
          const appoiments = await fetchReport(`/api/reports?filter=${filter}`);
          setData(await procesDataForDetailRp(appoiments));
        }
      } catch (err) {
        console.error("Error al cargar los datos:", err);
        setError("No se pudo cargar la información de reportes");
      }
    };
    loadData();
  }, [selectedItem, view]);

  useEffect(() => {
    const filtered = dataReport.filter((item) => {
      const matchesName =
        doctorName.trim() === "" ||
        (item["Nombre del doctor"] || "")
          .toLowerCase()
          .includes(doctorName.toLowerCase());
      return matchesName;
    });
    setFilteredData(filtered);
  }, [doctorName, dataReport]);

  const isAppointments = view === "appointments";
  const isServices = view === "services";
  const isContributions = view === "contributions";

  const handleExport = () => {
    let dataToExport, fileName, checker;
    if (isAppointments) {
      dataToExport = filteredData;
      fileName = "reporte_medicos.xlsx";
      checker = "ap";
    } else if (isContributions) {
      dataToExport = dataReportContr;
      fileName = "reporte_aportes.xlsx";
      checker = "ct";
    } else {
      dataToExport = dataReportServices;
      fileName = "reporte_servicios.xlsx";
      checker = "sv";
    }
    exportToExcel(
      dataToExport,
      checker,
      selectedItem ? selectedItem.label : "Dia",
      fileName
    );
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Reportes</h2>
          <p className="page-subtitle">
            Revisa los indicadores de la clínica y exporta los datos cuando lo
            necesites.
          </p>
        </div>
      </div>

      {error && (
        <Alert message={error} color="danger" setStatus={() => setError(null)} />
      )}

      {/* Tabs */}
      <div className="surface-card mb-5 p-2">
        <div className="flex flex-wrap gap-1">
          {VIEWS.map((v) => (
            <button
              key={v.key}
              type="button"
              onClick={() => setView(v.key)}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                view === v.key
                  ? "bg-brand-600 text-white shadow-soft"
                  : "text-ink-muted hover:bg-slate-50"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="surface-card mb-6 p-5 sm:p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-end">
          <div>
            <p className="mb-1.5 text-xs font-medium text-ink-muted">Periodo</p>
            <SimpleDropdown
              buttonLabel="Seleccione el periodo"
              menuItems={items}
              ariaLabel="Periodo del reporte"
              setItem={setSelectedItem}
            />
          </div>
          {isAppointments && (
            <SimpleInput
              label="Nombre de doctor"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
            />
          )}
          <div className={isAppointments ? "" : "md:col-span-2 md:justify-self-end"}>
            <PersonalButton
              content="Exportar a Excel"
              startIcon={iconExcel}
              color="success"
              action={handleExport}
            />
          </div>
        </div>
      </div>

      {/* Tables */}
      <div>
        {isContributions ? (
          <BasicTable
            data={dataReportContr}
            title="Reporte de aportes médicos"
            personalColums={[
              "Nombre del doctor",
              "Responsable",
              "Cantidad de aporte",
              "Fecha del aporte",
              "Glosa de aporte",
              "Tipo de Pago",
            ]}
            nameColOfDate="Fecha del aporte"
          />
        ) : isAppointments ? (
          <BasicTable
            data={filteredData}
            title="Reporte de consultas médicas"
            personalColums={[
              "Especialidad",
              "Nombre del doctor",
              "Tipo de consulta",
              "Responsable",
              "Porcentaje de descuento aplicado",
              "Costo de la Consulta",
              "Descripcion del convenio",
              "Tipo de Pago",
            ]}
          />
        ) : (
          <BasicTable
            data={dataReportServices}
            title="Reporte de servicios médicos"
            personalColums={[
              "Nombre del servicio medico",
              "Responsable",
              "Tipo de Pago",
              "Costo del servicio",
            ]}
          />
        )}
      </div>
    </div>
  );
}
