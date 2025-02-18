"use client";
import BasicTable from "@/components/Tables/BasicTable";
import SimpleInput from "@/components/Input";
import SimpleDropdown from "@/components/SimpleDropdown";
import { useEffect, useState } from "react";
import {
  processDataForGlobalReport,
  exportToExcel,
  fetchMedicalServices,
  processDataServices,
  fetchAppotimentReport,
  procesDataForDetailRp,
} from "./funtions";
import PersonalButton from "@/components/Button";
import { useSession } from "next-auth/react";
import { iconExcel } from "@/components/Icons";

export default function MedicalHistory() {
  const [dataReport, setData] = useState([]);
  const [dataReportServices, setDataServices] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [doctorName, setDoctorName] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const { data: session } = useSession();
  const [showAp, setshowAp] = useState(true);

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
        let filter = selectedItem ? selectedItem.key : "today";
        let filterName = selectedItem ? selectedItem.label : "Dia";
        if (!showAp) {
          const medicalServices = await fetchMedicalServices(
            `filter=${filter}`
          );
          const processedData = await processDataServices(
            medicalServices,
            filterName
          );
          setDataServices(processedData);
        } else {
          const appoiments = await fetchAppotimentReport(`filter=${filter}`);
          /*const processedData = await processDataForGlobalReport(
            appoiments,
            filterName
          );*/
          const dataProces = await procesDataForDetailRp(appoiments);
          setData(dataProces);
        }
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        setError("No se pudo cargar la lista de pacientes");
      }
    };

    loadData();
  }, [selectedItem, showAp]);

  useEffect(() => {
    const filtered = dataReport.filter((item) => {
      const matchesName =
        doctorName.trim() === "" ||
        item["Nombre del Doctor"]
          .toLowerCase()
          .includes(doctorName.toLowerCase());
      return matchesName;
    });
    setFilteredData(filtered);
  }, [doctorName, dataReport]);

  const handleNavigation = (isSpecialty) => {
    setshowAp(isSpecialty);
  };

  return (
    <div>
      <div className="mt-8 p-4 rounded-md">
        <div className="flex items-center mb-4">
          <label className="font-bold flex items-center mr-6">
            <input
              type="radio"
              name="selection"
              value="specialty"
              checked={showAp}
              onChange={() => handleNavigation(true)}
              className="mr-2"
            />
            Reporte médicos
          </label>
          <label className="font-bold flex items-center">
            <input
              type="radio"
              name="selection"
              value="services"
              checked={!showAp}
              onChange={() => handleNavigation(false)}
              className="mr-2"
            />
            Reporte servicios médicos
          </label>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <div className="flex-1">
          <SimpleDropdown
            buttonLabel="Seleccione el periodo"
            menuItems={items}
            ariaLabel="Actions"
            setItem={setSelectedItem}
          />
        </div>
        {showAp && (
          <div className="flex-1">
            <SimpleInput
              label="Ingrese el nombre de doctor"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
            />
          </div>
        )}
        <div>
          <PersonalButton
            content="Exportar a Excel"
            startIcon={iconExcel}
            color="success"
            action={() => {
              const dataToExport = showAp ? filteredData : dataReportServices;
              const fileName = showAp
                ? "reporte_medicos.xlsx"
                : "reporte_servicios.xlsx";
              const checker = showAp ? true : false;
              exportToExcel(
                dataToExport,
                checker,
                selectedItem ? selectedItem.label : "Dia",
                fileName
              );
            }}
          />
        </div>
      </div>

      <div>
        {showAp ? (
          <BasicTable
            data={filteredData}
            title={"Reporte de médicos"}
            personalColums={[
              "Especialidad",
              "Nombre del doctor",
              "Tipo de consulta",
              "Responsable",
              "Porcentaje de descuento aplicado",
              "Costo de la Consulta",
              "Descripcion del convenio",
            ]}
          />
        ) : (
          <BasicTable
            data={dataReportServices}
            title={"Reporte de servicios médicos"}
            personalColums={[
              "Nombre del servicio medico",
              `Total de servicios atendidos ${
                selectedItem ? selectedItem.label : "Dia"
              }`,
              "Total de ingreso",
            ]}
          />
        )}
      </div>
    </div>
  );
}
