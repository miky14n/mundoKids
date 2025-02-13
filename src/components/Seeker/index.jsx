import React, { useState, useEffect, useCallback } from "react"; // Importar useCallback
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import axios from "axios";

const SearchIcon = ({ size = 24, strokeWidth = 1.5, ...props }) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size}
      width={size}
      role="presentation"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
      <path
        d="M22 22L20 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

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

  return (
    <Autocomplete
      allowsCustomValue={true}
      isVirtualized
      className="max-w-xs"
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
        <AutocompleteItem key={patient.patient_id}>
          {`${patient.name} ${patient.last_name} ${new Date(
            patient.date_of_birth
          ).toLocaleDateString("es-ES")}`}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
