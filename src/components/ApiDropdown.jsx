"use client";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { useState, useEffect } from "react";

function getMenuItem(menuItems, buttonLabel, nameOfGet, id) {
  const foundItem = menuItems.find((item) => item[id] === buttonLabel);
  return foundItem ? foundItem[nameOfGet] : null;
}

export default function ApiDropdown({
  buttonLabel,
  urlApi,
  onActionName = () => {},
  onActionId = () => {},
  idOfGet,
  nameOfGet,
  filterLabel,
  filterValue,
  defaultText = "Elige una opción",
  aditonalStyle = "",
}) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApi = async () => {
      setLoading(true);
      try {
        const response = await fetch(urlApi, { method: "GET" });
        if (!response.ok) throw new Error("Error fetching data");
        const data = await response.json();
        setMenuItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApi();
  }, [urlApi]);

  if (loading)
    return (
      <div className="inline-flex h-10 w-full items-center rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-ink-faint">
        Cargando...
      </div>
    );
  if (error)
    return (
      <div className="inline-flex h-10 w-full items-center rounded-xl border border-red-200 bg-red-50 px-4 text-sm text-red-700">
        Error: {error}
      </div>
    );

  const handleSelect = (id, name) => {
    onActionName(name);
    onActionId(id);
  };

  const currentLabel = buttonLabel
    ? getMenuItem(menuItems, buttonLabel, nameOfGet, idOfGet)
    : defaultText;

  return (
    <Dropdown backdrop="opaque">
      <DropdownTrigger>
        <Button
          variant="bordered"
          className="w-full justify-between border-slate-200 bg-white font-normal text-ink-muted"
        >
          <span className="truncate text-left">{currentLabel || defaultText}</span>
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
      <DropdownMenu
        variant="faded"
        aria-label="Dropdown Actions"
        className={`${aditonalStyle}`}
      >
        {menuItems.map(
          (item, index) =>
            item[nameOfGet] &&
            (!filterLabel || item[filterLabel] === filterValue) && (
              <DropdownItem
                key={`${item[idOfGet]}-${index}`}
                onPress={() => handleSelect(item[idOfGet], item[nameOfGet])}
                shouldBlockScroll={false}
              >
                {String(item[nameOfGet])}
              </DropdownItem>
            )
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
