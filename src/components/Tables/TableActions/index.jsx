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
import { DeleteIcon, PasswordResetIcon } from "@/components/Icons";
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
  const [modalAction, setModalAction] = useState(null);

  const confirmAction = async () => {
    if (!selectedUser) return;

    try {
      if (modalAction === "delete") {
        await axios.delete(`/api/auth/users/${selectedUser[personal_id]}`);
        setDeleteUs(selectedUser);
      } else if (modalAction === "reset") {
        await axios.put(
          `/api/auth/users/${selectedUser[personal_id]}?email=${selectedUser.email}`
        );
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
              avatarProps={{
                radius: "lg",
                src: user.avatar,
                classNames: {
                  base: "bg-gradient-to-br from-brand-500 to-brand-700 text-white",
                },
                name: (cellValue || "?").charAt(0).toUpperCase(),
              }}
              description={
                <span className="text-ink-faint">{user.email}</span>
              }
              name={<span className="font-medium text-ink">{cellValue}</span>}
            />
          );
        case "role":
          return (
            <div className="flex flex-col">
              <p className="text-sm font-medium capitalize text-ink">
                {cellValue}
              </p>
              {user.team && (
                <p className="text-xs capitalize text-ink-faint">{user.team}</p>
              )}
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
            <div className="flex items-center justify-center gap-2">
              <Tooltip content="Restaurar contraseña">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUser(user);
                    setModalAction("reset");
                    setIsOpen(true);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-faint transition hover:bg-brand-50 hover:text-brand-700"
                >
                  <PasswordResetIcon />
                </button>
              </Tooltip>
              <Tooltip color="danger" content="Eliminar usuario">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUser(user);
                    setModalAction("delete");
                    setIsOpen(true);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50"
                >
                  <DeleteIcon />
                </button>
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
      <div className="surface-card overflow-hidden">
        <Table
          aria-label="Tabla de usuarios"
          removeWrapper
          classNames={{
            th: "bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-ink-muted",
            td: "text-sm text-ink",
          }}
        >
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
          <TableBody items={data} emptyContent="Sin usuarios registrados">
            {(item) => (
              <TableRow key={item[personal_id]}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} backdrop="blur">
        <ModalContent>
          <ModalHeader>
            {modalAction === "delete"
              ? "Eliminar usuario"
              : "Restaurar contraseña"}
          </ModalHeader>
          <ModalBody>
            <p className="text-sm text-ink-muted">
              {modalAction === "delete"
                ? `¿Estás seguro de que deseas eliminar a ${selectedUser?.user_name}? Esta acción no se puede deshacer.`
                : `¿Deseas enviar una nueva contraseña temporal a ${selectedUser?.user_name}?`}
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
