"use client";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { useState, useEffect } from "react";

export default function ApiDropdown({
  buttonLabel,
  urlApi,
  onActionName = () => {},
  onActionId = () => {},
  idOfGet,
  nameOfGet,
}) {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItemName, setSelectedItemName] = useState(
    buttonLabel || "Choose an option"
  );
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
    setSelectedItemName(name);
    console.log(id);
    onActionName(name);
    onActionId(id);
  };

  return (
    <Dropdown backdrop="blur">
      <DropdownTrigger>
        <Button variant="bordered">{selectedItemName}</Button>
      </DropdownTrigger>
      <DropdownMenu variant="faded" aria-label="Dropdown Actions">
        {menuItems.map((item, index) => {
          //console.log(item[nameOfGet], "index", index);
          return (
            item[nameOfGet] && (
              <DropdownItem
                key={`${item[idOfGet]}-${index}`}
                onClick={() => handleSelect(item[idOfGet], item[nameOfGet])}
              >
                {String(item[nameOfGet])}
              </DropdownItem>
            )
          );
        })}
      </DropdownMenu>
    </Dropdown>
  );
}
