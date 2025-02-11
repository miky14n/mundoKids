"use client";
import TableActions from "@/components/Tables/TableActions";
import { useEffect, useState } from "react";
import axios from "axios";
export default function UsersList(params) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false); // Se define setLoading
  const [deleteUs, setDeleteUs] = useState(null);
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/auth/users`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error buscando usuarios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [deleteUs]);
  const columns = [
    { name: "Nombre", uid: "user_name" },
    { name: "Rol", uid: "role" },
    { name: "Estado", uid: "active_account" },
    { name: "Acciones", uid: "actions" },
  ];

  return (
    <>
      <TableActions
        columns={columns}
        data={users}
        personal_id="user_id"
        statusLable="active_account"
        setDeleteUs={setDeleteUs}
      />
    </>
  );
}
