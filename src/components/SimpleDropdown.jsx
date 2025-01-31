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
    const selected = menuItems.find((item) => item.key === key) || menuItems[0];
    console.log(menuItems[0]);
    setSelectedItem(selected.label);
    setItem(selected);
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
