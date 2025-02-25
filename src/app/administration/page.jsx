"use client";
import BasicTable from "@/components/Tables/BasicTable";
import SimpleInput from "@/components/Input";
import SimpleDropdown from "@/components/SimpleDropdown";
import { useEffect, useState } from "react";
import {
  exportToExcel,
  processDataServices,
  procesDataForDetailRp,
  fetchReport,
} from "./funtions";
import PersonalButton from "@/components/Button";
import { useSession } from "next-auth/react";
import { iconExcel } from "@/components/Icons";

export default function MedicalHistory() {
  const [dataReport, setData] = useState([]);
  const [dataReportServices, setDataServices] = useState([]);
  const [dataReportContr, setDataContr] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [doctorName, setDoctorName] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const { data: session } = useSession();
  const [showAp, setshowAp] = useState(true);
  const [showContributions, setshowContributions] = useState(false);

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
          const medicalServices = await fetchReport(
            `/api/reports/medical-services?filter=${filter}`
          );
          /**const processedData = await processDataServices(
            medicalServices,
            filterName
          ); console.log(processedData);*/
          const dataProcesSv = await procesDataForDetailRp(medicalServices);
          setDataServices(dataProcesSv);
        } else {
          const appoiments = await fetchReport(`/api/reports?filter=${filter}`);
          /*const processedData = await processDataForGlobalReport(
            appoiments,
            filterName
          );*/
          const dataProces = await procesDataForDetailRp(appoiments);
          setData(dataProces);
        }
        if (showContributions) {
          const contributions = await fetchReport(
            `/api/reports/doctor-contributions?filter=${filter}`
          );

          setDataContr(await procesDataForDetailRp(contributions));
        }
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        setError("No se pudo cargar la lista de pacientes");
      }
    };

    loadData();
  }, [selectedItem, showAp, showContributions]);

  useEffect(() => {
    console.log("Cuando entro en el filtro", dataReport);
    const filtered = dataReport.filter((item) => {
      const matchesName =
        doctorName.trim() === "" ||
        item["Nombre del doctor"]
          .toLowerCase()
          .includes(doctorName.toLowerCase());
      return matchesName;
    });
    setFilteredData(filtered);
  }, [doctorName, dataReport]);

  const handleNavigation = (isSpecialty) => {
    setshowAp(isSpecialty);
    setshowContributions(false); // Asegurar que no se muestre la tabla de aportes médicos
  };

  const handleNavigationCtb = () => {
    setshowAp(false); // Asegurar que se oculten las otras tablas
    setshowContributions(true);
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
              checked={showAp && !showContributions}
              onChange={() => handleNavigation(true)}
              className="mr-3"
            />
            Reporte médicos
          </label>
          <label className="font-bold flex items-center mr-6">
            <input
              type="radio"
              name="selection"
              value="services"
              checked={!showAp && !showContributions}
              onChange={() => handleNavigation(false)}
              className="mr-3"
            />
            Reporte servicios médicos
          </label>
          <label className="font-bold flex items-center">
            <input
              type="radio"
              name="selection"
              value="contributions"
              checked={showContributions}
              onChange={() => handleNavigationCtb()}
              className="mr-3"
            />
            Reporte de aportes médicos
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

        {showAp && !showContributions && (
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
              let dataToExport, fileName, checker;
              if (showAp) {
                dataToExport = filteredData;
                fileName = "reporte_medicos.xlsx";
                checker = "ap";
              } else if (showContributions) {
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
            }}
          />
        </div>
      </div>

      {/* Renderizado de las tablas */}
      <div className="mt-4">
        {showContributions ? (
          <BasicTable
            data={dataReportContr}
            title={"Reporte de aportes médicos"}
            personalColums={[
              "Nombre del doctor",
              "Responsable",
              "Cantidad de aporte",
              "Fecha del aporte",
              "Glosa de aporte",
              "Tipo de Pago",
            ]}
            nameColOfDate={"Fecha del aporte"}
          />
        ) : showAp ? (
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
              "Tipo de Pago",
            ]}
          />
        ) : (
          <BasicTable
            data={dataReportServices}
            title={"Reporte de servicios médicos"}
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
