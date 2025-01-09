"use client";
import { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  getKeyValue,
} from "@nextui-org/react";

export default function BasicTable({
  data,
  title = null,
  personalColums = null,
  rowsPerPage = 4,
}) {
  const [page, setPage] = useState(1);
  console.log("el name", personalColums, "los datos", data);
  let columns;
  let validData = data;
  if (!Array.isArray(data)) {
    validData = [data];
  }

  if (!personalColums) {
    columns = validData.length > 0 ? Object.keys(validData[0]) : [];
  }

  const pages = Math.ceil(validData.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return validData.slice(start, end);
  }, [page, rowsPerPage, validData]);

  return (
    <div>
      {title && (
        <div className="text-ellipsis mb-4 pl-4 pr-4">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <hr className="border-t-2 border-gray-300 mt-2" />
        </div>
      )}
      {validData.length > 0 && (
        <Table
          aria-label="Dynamic table with client-side pagination"
          bottomContent={
            validData.length > rowsPerPage ? (
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="secondary"
                  page={page}
                  total={pages}
                  onChange={(page) => setPage(page)}
                />
              </div>
            ) : (
              <></>
            )
          }
          classNames={{
            wrapper: "min-h-[222px]",
          }}
        >
          <TableHeader>
            {(personalColums || columns).map((col) => (
              <TableColumn key={col}>{col.toUpperCase()}</TableColumn>
            ))}
          </TableHeader>
          <TableBody items={items}>
            {(item) => (
              <TableRow key={item.id || item[(personalColums || columns)[0]]}>
                {(personalColums || columns).map((col) => (
                  <TableCell key={col}>
                    {item[col] !== null && item[col] !== undefined
                      ? item[col].toString()
                      : "Dato no registrado"}
                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
