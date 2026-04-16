"use client";
import { useState } from "react";
import {
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem,
  Button,
} from "@heroui/react";

export default function SimpleDropdown({
  buttonLabel,
  menuItems,
  ariaLabel,
  setItem,
}) {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSelect = (key) => {
    const selected = menuItems.find((item) => item.key === key) || menuItems[0];
    setSelectedItem(selected.label);
    setItem(selected);
  };

  return (
    <Dropdown backdrop="opaque">
      <DropdownTrigger>
        <Button
          variant="bordered"
          className="w-full justify-between border-slate-200 bg-white font-normal text-ink-muted"
        >
          <span className="truncate text-left">
            {selectedItem ? selectedItem : buttonLabel}
          </span>
          <svg
            className="h-4 w-4 text-ink-faint"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
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
