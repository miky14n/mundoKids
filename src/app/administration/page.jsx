"use client";
import BasicTable from "@/components/Tables/BasicTable";
import SimpleInput from "@/components/Input";
import SimpleDropdown from "@/components/SimpleDropdown";
import { useEffect, useState } from "react";
import {
  fetchAppointments,
  processData,
  exportToExcel,
  fetchMedicalServices,
  processDataServices,
} from "./funtions";
import PersonalButton from "@/components/Button";
import { useSession } from "next-auth/react";

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
          const appoiments = await fetchAppointments(`filter=${filter}`);
          const processedData = await processData(appoiments, filterName);
          setData(processedData);
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

  const iconExcel = (
    <svg
      className="w-[25px] h-[25px] fill-[#000000]"
      viewBox="0 0 384 512"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M48 448V64c0-8.8 7.2-16 16-16H224v80c0 17.7 14.3 32 32 32h80V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16zM64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V154.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0H64zm90.9 233.3c-8.1-10.5-23.2-12.3-33.7-4.2s-12.3 23.2-4.2 33.7L161.6 320l-44.5 57.3c-8.1 10.5-6.3 25.5 4.2 33.7s25.5 6.3 33.7-4.2L192 359.1l37.1 47.6c8.1 10.5 23.2 12.3 33.7 4.2s12.3-23.2 4.2-33.7L222.4 320l44.5-57.3c8.1-10.5 6.3-25.5-4.2-33.7s-25.5-6.3-33.7 4.2L192 280.9l-37.1-47.6z"></path>
    </svg>
  );

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
        <div className="flex-1">
          <SimpleInput
            label="Ingrese el nombre de doctor"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
          />
        </div>
        <div>
          <PersonalButton
            content="Exportar a Excel"
            startIcon={iconExcel}
            color="success"
            action={() => {
              const dataToExport = showAp ? filteredData : dataReportServices;
              const fileName = showAp ? "reporte_medicos" : "reporte_servicios";
              const checker = showAp ? true : false;
              exportToExcel(
                dataToExport,
                selectedItem ? selectedItem.label : "Dia",
                `${fileName} ${selectedItem ? selectedItem.label : "Dia"}.xlsx`,
                checker
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
              "Nombre del Doctor",
              `Total de consultas ${selectedItem ? selectedItem.label : "Dia"}`,
              "Total de ingreso",
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
