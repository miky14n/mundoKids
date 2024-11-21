import React from "react";
import { DatePicker } from "@nextui-org/react";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";

export default function InputDate({ setDateBorn }) {
  const [value, setValue] = React.useState(parseDate("2014-04-04"));

  let formatter = useDateFormatter({ dateStyle: "full" });

  return (
    <div className="flex flex-row gap-2">
      <div className="w-full flex flex-col gap-y-2">
        <DatePicker
          className="max-w-[284px]"
          label="Date (controlled)"
          value={value}
          onChange={(newValue) => {
            setValue(newValue); // Mantiene el formato original en el estado local
            const isoDate = newValue.toString(); // Convierte a formato ISO (ej. "2014-04-04")
            setDateBorn(isoDate); // Pasa la fecha en formato ISO
          }}
        />
        {
          <p className="text-default-500 text-sm">
            Selected date:{" "}
            {value ? formatter.format(value.toDate(getLocalTimeZone())) : "--"}
          </p>
        }
      </div>
    </div>
  );
}
