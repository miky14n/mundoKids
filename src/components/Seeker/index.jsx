import React, { useState, useEffect, useCallback } from "react"; // Importar useCallback
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import axios from "axios";
import { SearchIcon } from "../Icons";

export default function Seeker({
  title = "Title Seeker",
  description = "Put parameter to seek",
  resultSeek = "Result after to seek",
  apiUrl = "put api address please",
  voidMessage = "No item detected",
  getValue,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Memorizamos la función `searchPatients` con useCallback
  const searchPatients = useCallback(
    async (term) => {
      setLoading(true);
      try {
        const response = await axios.get(`${apiUrl}=${term}`);
        setPatients(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error buscando pacientes:", error);
      } finally {
        setLoading(false);
      }
    },
    [apiUrl]
  ); // apiUrl es la única dependencia importante para esta función

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        searchPatients(searchTerm);
      } else {
        setPatients([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchPatients]);

  const onSelectionChange = (id) => {
    const selected = patients.find((p) => {
      return p.patient_id === parseInt(id);
    });

    if (selected) {
      setSelectedPatient(selected);
      getValue(selected);
    }
  };
  const formatDate = (isoString) => {
    if (!isoString) return ""; // Manejo de valores vacíos o undefined

    const parts = isoString.split("T")[0].split("-"); // Separar la fecha
    if (parts.length !== 3) return "Fecha inválida"; // Validar formato correcto

    return `${parts[2]}/${parts[1]}/${parts[0]}`; // Formato DD/MM/YYYY
  };
  return (
    <Autocomplete
      allowsCustomValue={true}
      isVirtualized
      className="w-96 max-w-full" // Ampliar el ancho del input
      label={title}
      placeholder={description}
      description={resultSeek}
      onInputChange={(value) => setSearchTerm(value)}
      defaultItems={patients}
      isLoading={loading}
      listboxProps={{
        emptyContent: voidMessage,
      }}
      scrollShadowProps={{
        isEnabled: false,
      }}
      labelPlacement="inside"
      onSelectionChange={onSelectionChange}
      startContent={
        <SearchIcon className="text-default-400" size={20} strokeWidth={2.5} />
      }
    >
      {(patient) => (
        <AutocompleteItem
          key={patient.patient_id}
          className="text-lg w-full whitespace-nowrap overflow-hidden"
        >
          {`${patient.name} ${patient.last_name} ${formatDate(
            patient.date_of_birth
          )}`}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
