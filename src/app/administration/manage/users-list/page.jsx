"use client";
import TableActions from "@/components/Tables/TableActions";
import PersonalButton from "@/components/Button";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

function IconUserPlus(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="9" cy="8" r="4" />
      <path d="M3 21a6 6 0 0 1 12 0M19 8v6M16 11h6" />
    </svg>
  );
}

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
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
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Usuarios del sistema</h2>
          <p className="page-subtitle">
            Gestiona las cuentas del personal clínico. {users.length > 0 && `${users.length} usuarios registrados.`}
          </p>
        </div>
        <Link href="/auth/register">
          <PersonalButton
            content="Registrar usuario"
            color="primary"
            startIcon={<IconUserPlus className="h-4 w-4" />}
          />
        </Link>
      </div>

      {loading ? (
        <div className="surface-card flex items-center justify-center p-10 text-sm text-ink-soft">
          Cargando usuarios...
        </div>
      ) : (
        <TableActions
          columns={columns}
          data={users}
          personal_id="user_id"
          statusLable="active_account"
          setDeleteUs={setDeleteUs}
        />
      )}
    </div>
  );
}
