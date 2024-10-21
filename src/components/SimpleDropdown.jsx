import { useState } from "react";
import {
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem,
  Button,
} from "@nextui-org/react";

export default function SimpleDropdown({
  buttonLabel,
  menuItems,
  ariaLabel,
  setItem,
}) {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSelect = (key) => {
    const selected = menuItems.find((item) => item.key === key);
    setSelectedItem(selected.label); // Actualiza el estado interno del componente
    setItem(selected); // Llama a la función que actualiza el valor en el componente padre
  };

  return (
    <Dropdown backdrop="blur">
      <DropdownTrigger>
        <Button variant="bordered">
          {selectedItem ? selectedItem : buttonLabel}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label={ariaLabel} onAction={handleSelect}>
        {menuItems.map((item) => (
          <DropdownItem key={item.key}>{item.label}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
