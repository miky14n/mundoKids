"use client";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
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
  defaultText = "Choose any option",
  aditonalStyle = "",
}) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApi = async () => {
      setLoading(true);
      try {
        const response = await fetch(urlApi, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Error fetching data");
        }
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleSelect = (id, name) => {
    onActionName(name);
    onActionId(id);
  };

  return (
    <Dropdown backdrop="blur">
      <DropdownTrigger>
        <Button variant="bordered">
          {buttonLabel
            ? getMenuItem(menuItems, buttonLabel, nameOfGet, idOfGet)
            : defaultText}
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
                onPress={() => handleSelect(item[idOfGet], item[nameOfGet])} // Cambiado a `onPress`
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
