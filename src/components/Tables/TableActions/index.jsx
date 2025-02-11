"use client";
import React, { useState } from "react";
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
} from "@nextui-org/react";
import { EyeIcon, DeleteIcon, EditIcon } from "@/components/Icons";
import axios from "axios";
import { useRouter } from "next/navigation";
export default function TableActions({
  columns,
  data,
  personal_id = "id",
  statusLable = "status",
  setDeleteUs,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsOpen(true);
  };
  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await axios.delete(`/api/auth/users/${userToDelete[personal_id]}`);
        console.log("Usuario eliminado:", userToDelete);
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
      }
    }
    setDeleteUs(userToDelete);
    setIsOpen(false);
    setUserToDelete(null);
  };

  const renderCell = React.useCallback(
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
              {/*<Tooltip content="Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content="Edit user">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditIcon />
              </span>
            </Tooltip>*/}
              <Tooltip color="danger" content="Delete user">
                <span
                  className="text-lg text-danger cursor-pointer active:opacity-50"
                  onClick={() => handleDeleteClick(user)}
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
      <Table aria-label="Example table with custom cells">
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

      {/* Modal de Confirmación */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent>
          <ModalHeader>Eliminar Usuario</ModalHeader>
          <ModalBody>
            <p>
              ¿Estás seguro de que deseas eliminar a {userToDelete?.user_name}?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button color="danger" onPress={confirmDelete}>
              Eliminar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
