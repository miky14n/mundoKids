import React, { useState } from "react";

export default function InputDate({ setDateBorn }) {
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    const newValue = event.target.value; // Obtiene el valor seleccionado
    setValue(newValue); // Actualiza el estado local
    setDateBorn(newValue); // Pasa el valor al componente padre
  };

  return (
    <div className="relative max-w-sm">
      {/* Input de fecha */}
      <input
        id="default-datepicker"
        type="date" // Tipo de input de fecha nativo
        value={value}
        onChange={handleChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Seleccione una fecha"
      />
    </div>
  );
}
/**import React from "react";
import { DatePicker } from "@nextui-org/react";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";

export default function InputDate({ setDateBorn }) {
  const [value, setValue] = React.useState(parseDate("2010-04-04"));

  let formatter = useDateFormatter({ dateStyle: "full" });

  return (
    <div className="flex flex-row gap-2">
      <div className="w-full flex flex-col gap-y-2">
        <DatePicker
          showMonthAndYearPickers
          variant="bordered"
          className="max-w-[284px]"
          label="Ingrese la Fecha de Nacimiento"
          value={value}
          onChange={(newValue) => {
            setValue(newValue); // Mantiene el formato original en el estado local
            const isoDate = newValue.toString(); // Convierte a formato ISO (ej. "2014-04-04")
            setDateBorn(isoDate); // Pasa la fecha en formato ISO
          }}
        />
        {/*
          <p className="text-default-500 text-sm">
            Selected date:{" "}
            {value ? formatter.format(value.toDate(getLocalTimeZone())) : "--"}
          </p>
        }
        </div>
        </div>
      );
    } */
