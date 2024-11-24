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
  console.log(" lo que retorna el metodo:", menuItems);
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
}) {
  const [menuItems, setMenuItems] = useState([]);
  /*const [selectedItemName, setSelectedItemName] = useState(
    buttonLabel || "Choose an option"
  );*/
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
        const addData = [{ categoryname: "Todos", idcategory: 99 }, ...data];
        setMenuItems(addData);
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
    //setSelectedItemName(name);
    console.log(id);
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
      <DropdownMenu variant="faded" aria-label="Dropdown Actions">
        {menuItems.map(
          (item, index) =>
            item[nameOfGet] &&
            (!filterLabel || item[filterLabel] === filterValue) && (
              <DropdownItem
                key={`${item[idOfGet]}-${index}`}
                onClick={() => handleSelect(item[idOfGet], item[nameOfGet])}
              >
                {String(item[nameOfGet])}
              </DropdownItem>
            )
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
