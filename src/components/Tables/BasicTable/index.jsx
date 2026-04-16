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
} from "@heroui/react";

export default function BasicTable({
  data,
  title = null,
  personalColums = null,
  rowsPerPage = 30,
  nameColOfDate = null,
  emptyMessage = "Sin datos para mostrar",
}) {
  const [page, setPage] = useState(1);
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

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const parts = isoString.split("T")[0].split("-");
    if (parts.length !== 3) return "Fecha inválida";
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  return (
    <div className="surface-card overflow-hidden">
      {title && (
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="section-title">{title}</h3>
          {validData.length > 0 && (
            <span className="pill bg-slate-100 text-ink-muted">
              {validData.length} registro{validData.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}
      {validData.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-ink-faint">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M3 10h18" />
            </svg>
          </div>
          <p className="mt-3 text-sm font-medium text-ink">{emptyMessage}</p>
          <p className="mt-1 text-xs text-ink-faint">
            Cuando haya información aparecerá aquí.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table
            aria-label="Dynamic table"
            removeWrapper
            bottomContent={
              validData.length > rowsPerPage ? (
                <div className="flex w-full justify-center py-4">
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={(p) => setPage(p)}
                  />
                </div>
              ) : null
            }
            classNames={{
              th: "bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-ink-muted",
              td: "text-sm text-ink",
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
                        ? col === nameColOfDate
                          ? formatDate(item[col])
                          : item[col].toString()
                        : "—"}
                    </TableCell>
                  ))}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
