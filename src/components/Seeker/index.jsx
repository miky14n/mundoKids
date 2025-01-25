import React, { useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import axios from "axios";
const SearchIcon = ({
  size = 24,
  strokeWidth = 1.5,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={height || size}
      role="presentation"
      viewBox="0 0 24 24"
      width={width || size}
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
  apiUrl = "put api adres pleas",
  voidMessage = "No item detected",
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        searchPatients(searchTerm);
      } else {
        setPatients([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const searchPatients = async (term) => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}=${term}`);
      setPatients(response.data);
    } catch (error) {
      console.error("Error buscando pacientes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Autocomplete
      isVirtualized
      className="max-w-xs"
      label={title}
      placeholder={description}
      description={resultSeek}
      isLoading={loading}
      onInputChange={(value) => setSearchTerm(value)}
      defaultItems={patients}
      listboxProps={{
        emptyContent: voidMessage,
        itemClasses: {
          base: [
            "rounded-medium",
            "text-default-500",
            "transition-opacity",
            "data-[hover=true]:text-foreground",
            "dark:data-[hover=true]:bg-default-50",
            "data-[pressed=true]:opacity-70",
            "data-[hover=true]:bg-default-200",
            "data-[selectable=true]:focus:bg-default-100",
            "data-[focus-visible=true]:ring-default-500",
          ],
        },
      }}
      labelPlacement="inside"
      popoverProps={{
        offset: 10,
        classNames: {
          base: "rounded-large",
          content: "p-1 border-small border-default-100 bg-background",
        },
      }}
      startContent={
        <SearchIcon className="text-default-400" size={20} strokeWidth={2.5} />
      }
    >
      {(patient) => (
        <AutocompleteItem key={patient.patient_id}>
          {`${patient.name} ${patient.last_name}`}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
