"use client";
import BasicTable from "@/components/BasicTable";
import SimpleInput from "@/components/Input";
import SimpleDropdown from "@/components/SimpleDropdown";
import { useEffect, useState } from "react";
import { fetchAppointments, processData, exportToExcel } from "./funtions";
import PersonalButton from "@/components/Button";

export default function MedicalHistory() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [doctorName, setDoctorName] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const items = [
    { key: "today", label: "Dia" },
    { key: "week", label: "Semana" },
    { key: "month", label: "Mes" },
  ];
  useEffect(() => {
    const loadData = async () => {
      try {
        const filter = selectedItem ? selectedItem.key : "today";
        const filterName = selectedItem ? selectedItem.label : "Dia";
        const appoiments = await fetchAppointments(`filter=${filter}`);
        const processedData = await processData(appoiments, filterName);
        setData(processedData);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        setError("No se pudo cargar la lista de pacientes");
      }
    };

    loadData();
  }, [selectedItem]);

  useEffect(() => {
    const filtered = data.filter((item) => {
      // Filtro por nombre del doctor
      const matchesName =
        doctorName.trim() === "" ||
        item["Nombre del Doctor"]
          .toLowerCase()
          .includes(doctorName.toLowerCase());
      return matchesName;
    });
    setFilteredData(filtered);
  }, [doctorName, data]);
  const iconExcel = (
    <svg
      className="w-[25px] h-[25px] fill-[#000000]"
      viewBox="0 0 384 512"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/*! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. */}
      <path d="M48 448V64c0-8.8 7.2-16 16-16H224v80c0 17.7 14.3 32 32 32h80V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16zM64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V154.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0H64zm90.9 233.3c-8.1-10.5-23.2-12.3-33.7-4.2s-12.3 23.2-4.2 33.7L161.6 320l-44.5 57.3c-8.1 10.5-6.3 25.5 4.2 33.7s25.5 6.3 33.7-4.2L192 359.1l37.1 47.6c8.1 10.5 23.2 12.3 33.7 4.2s12.3-23.2 4.2-33.7L222.4 320l44.5-57.3c8.1-10.5 6.3-25.5-4.2-33.7s-25.5-6.3-33.7 4.2L192 280.9l-37.1-47.6z"></path>
    </svg>
  );
  const showColums = [
    "Especialidad",
    "Nombre del Doctor",
    `Total de consultas ${selectedItem ? selectedItem.label : "Dia"}`,
    "Total de ingreso",
  ];
  return (
    <div>
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
            action={() =>
              exportToExcel(
                filteredData,
                selectedItem ? selectedItem.label : "Dia",
                `Reporte Doctores ${
                  selectedItem ? selectedItem.label : "Dia"
                }.xlsx`
              )
            }
          />
        </div>
      </div>

      <div>
        <BasicTable
          data={filteredData}
          title={"Reporte de medicos"}
          personalColums={showColums}
        />
      </div>
      <div></div>
    </div>
  );
}
