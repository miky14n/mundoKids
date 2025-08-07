"use client";
import React, { useState, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import {
  EyeIcon,
  DeleteIcon,
  EditIcon,
  PasswordResetIcon,
} from "@/components/Icons";
import axios from "axios";

export default function TableActions({
  columns,
  data,
  personal_id = "id",
  statusLable = "status",
  setDeleteUs,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalAction, setModalAction] = useState(null); // 'delete' o 'reset'

  const confirmAction = async () => {
    if (!selectedUser) return;

    try {
      if (modalAction === "delete") {
        await axios.delete(`/api/auth/users/${selectedUser[personal_id]}`);
        console.log("Usuario eliminado:", selectedUser);
        setDeleteUs(selectedUser);
      } else if (modalAction === "reset") {
        const response=  await axios.put(
            `/api/auth/users/${selectedUser[personal_id]}?email=${selectedUser.email}`
          );
        console.log("Contraseña reiniciada para:", selectedUser, response.data);
      }
    } catch (error) {
      console.error("Error en la acción:", error);
    }

    setIsOpen(false);
    setSelectedUser(null);
    setModalAction(null);
  };

  const renderCell = useCallback(
    (user, columnKey) => {
      const cellValue = user[columnKey];

      switch (columnKey) {
        case "user_name":
          return (
            <User
              avatarProps={{ radius: "lg", src: user.avatar }}
              description={user.email}
              name={cellValue}
            >
              {user.email}
            </User>
          );
        case "role":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{cellValue}</p>
              <p className="text-bold text-sm capitalize text-default-400">
                {user.team}
              </p>
            </div>
          );
        case statusLable:
          return (
            <Chip
              className="capitalize"
              color={user.active_account ? "success" : "danger"}
              size="sm"
              variant="flat"
            >
              {user.active_account ? "Activo" : "Desactivado"}
            </Chip>
          );
        case "actions":
          return (
            <div className="flex justify-center items-center gap-2 w-full h-full">
              <Tooltip content="Restaurar Contraseña">
                <span
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                  onClick={() => {
                    setSelectedUser(user);
                    setModalAction("reset");
                    setIsOpen(true);
                  }}
                >
                  <PasswordResetIcon />
                </span>
              </Tooltip>

              <Tooltip color="danger" content="Eliminar usuario">
                <span
                  className="text-lg text-danger cursor-pointer active:opacity-50"
                  onClick={() => {
                    setSelectedUser(user);
                    setModalAction("delete");
                    setIsOpen(true);
                  }}
                >
                  <DeleteIcon />
                </span>
              </Tooltip>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [statusLable]
  );

  return (
    <>
      <Table aria-label="Tabla de usuarios con acciones personalizadas">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={data}>
          {(item) => (
            <TableRow key={item[personal_id]}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Modal reutilizable */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent>
          <ModalHeader>
            {modalAction === "delete"
              ? "Eliminar Usuario"
              : "Restaurar Contraseña"}
          </ModalHeader>
          <ModalBody>
            <p>
              {modalAction === "delete"
                ? `¿Estás seguro de que deseas eliminar a ${selectedUser?.user_name}?`
                : `¿Estás seguro de que deseas restaurar la contraseña de ${selectedUser?.user_name}?`}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button
              color={modalAction === "delete" ? "danger" : "primary"}
              onPress={confirmAction}
            >
              {modalAction === "delete" ? "Eliminar" : "Restaurar"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
