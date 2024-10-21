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
  onAction,
  idOfGet,
  nameOfGet,
}) {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItemName, setSelectedItemName] = useState(
    buttonLabel || "Open Menu"
  ); // Para mostrar el elemento seleccionado
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch de las categorías desde la API
  useEffect(() => {
    const fetchApi = async () => {
      setLoading(true);
      try {
        const response = await fetch(urlApi, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Error fetching categories");
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
  const handleSelect = (name) => {
    setSelectedItemName(name);
    onAction(name);
  };

  return (
    <Dropdown backdrop="blur">
      <DropdownTrigger>
        <Button variant="bordered">{selectedItemName}</Button>
      </DropdownTrigger>
      <DropdownMenu variant="faded" aria-label="Category Actions">
        {menuItems.map((item) => (
          <DropdownItem
            key={item[idOfGet]}
            onClick={() => handleSelect(item[nameOfGet])}
          >
            {item[nameOfGet]}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
