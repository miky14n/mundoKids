import React from "react";
import { DatePicker } from "@nextui-org/react";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";

export default function InputDate({ setDateBorn }) {
  const [value, setValue] = React.useState(parseDate("2024-04-04"));

  let formatter = useDateFormatter({ dateStyle: "full" });

  return (
    <div className="flex flex-row gap-2">
      <div className="w-full flex flex-col gap-y-2">
        <DatePicker
          className="max-w-[284px]"
          label="Date (controlled)"
          value={value}
          onChange={(newValue) => {
            setValue(newValue); // Aquí establecemos la nueva fecha en el estado
            setDateBorn(newValue); // También pasamos la nueva fecha a la función setDateBorn
          }}
        />
        {/*<p className="text-default-500 text-sm">
          Selected date:{" "}
          {value ? formatter.format(value.toDate(getLocalTimeZone())) : "--"}
        </p>*/}
      </div>
    </div>
  );
}
