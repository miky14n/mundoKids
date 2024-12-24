"use client";
import BasicForm from "@/components/BasicForm";
import BasicTable from "@/components/BasicTable";
import SimpleInput from "@/components/Input";
import SimpleDropdown from "@/components/SimpleDropdown";
import { useEffect, useState } from "react";
import { fetchAppointments, processData } from "./funtions";

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
        const appoiments = await fetchAppointments(`filter=${filter}`);
        const processedData = await processData(appoiments);
        setData(processedData);
        console.log("Consultas médicas cargadas:", processedData);
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

  return (
    <div>
      <div className="grid grid-cols-2 gap-6 mt-4">
        <div>
          <SimpleDropdown
            buttonLabel="Seleccione el periodo"
            menuItems={items}
            ariaLabel="Actions"
            setItem={setSelectedItem}
          />
        </div>
        <SimpleInput
          label="Ingrese el nombre de doctor"
          value={doctorName}
          onChange={(e) => setDoctorName(e.target.value)}
        />
      </div>
      <div>
        <BasicTable data={filteredData} />
      </div>
    </div>
  );
}
