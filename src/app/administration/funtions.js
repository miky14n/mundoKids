import { castColumns } from "../medical-history/[id]/functionsForOne";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
const fetchAppointments = async (aditionalQuery) => {
  try {
    const response = await fetch(`/api/appointment?${aditionalQuery}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Error al obtener los datos: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al buscar la cita médica:", error);
    throw error;
  }
};

const fetchReport = async (query) => {
  try {
    const response = await fetch(`${query}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Error al obtener los datos: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener datos:", error);
    throw error;
  }
};

const procesDataForDetailRp = async (data, filterName) => {
  console.log(data, "los datos  ");

  const renamedResults = data.map((item) => {
    const renamedItem = {};
    Object.keys(item).forEach((key) => {
      const translatedKey = castColumns([key], filterName)[0];
      renamedItem[translatedKey] = item[key];
    });
    return renamedItem;
  });

  return renamedResults;
};

const formatDate = (isoString) => {
  if (!isoString) return ""; // Manejo de valores vacíos o undefined

  const parts = isoString.split("T")[0].split("-"); // Separar la fecha
  if (parts.length !== 3) return "Fecha inválida"; // Validar formato correcto

  return `${parts[2]}/${parts[1]}/${parts[0]}`; // Formato DD/MM/YYYY
};
const exportToExcel = (
  data,
  showAp,
  filterName,
  fileName = "reporte_medico.xlsx"
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Reporte Médico");
  const currentDate = new Date().toLocaleDateString("es-ES");
  console.log(showAp);
  switch (showAp) {
    case "ap":
      worksheet.columns = [
        { header: "Especialidad", key: "especialidad", width: 30 },
        { header: "Nombre del Doctor", key: "doctor", width: 30 },
        { header: "Tipo de Consulta", key: "tipoConsulta", width: 20 },
        { header: "Responsable", key: "responsable", width: 25 },
        {
          header: "Porcentaje de Descuento Aplicado",
          key: "descuento",
          width: 25,
        },
        { header: "Costo de la Consulta", key: "costoConsulta", width: 20 },
        {
          header: "Descripción del Convenio",
          key: "descripcionConvenio",
          width: 40,
        },
        { header: "Fecha de Extracción", key: "fechaExtraccion", width: 25 },
        { header: "Tipo de pago", key: "paymentType", width: 15 },
      ];

      data.forEach((item) => {
        worksheet.addRow({
          especialidad: item["Especialidad"],
          doctor: item["Nombre del doctor"],
          tipoConsulta: item["Tipo de consulta"],
          responsable: item["Responsable"],
          descuento: item["Porcentaje de descuento aplicado"],
          costoConsulta: parseFloat(item["Costo de la Consulta"]) || 0,
          descripcionConvenio: item["Descripcion del convenio"],
          fechaExtraccion: currentDate,
          paymentType: item["Tipo de Pago"],
        });
      });

      // Calcular total de ingresos
      const totalIngreso = data.reduce(
        (sum, item) => sum + (parseFloat(item["Costo de la Consulta"]) || 0),
        0
      );

      // Agregar fila con el total
      const totalRow = worksheet.addRow({
        especialidad: "Total Ingreso",
        costoConsulta: totalIngreso.toFixed(2),
      });

      totalRow.getCell("costoConsulta").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF00" },
      };
      break;

    case "sv":
      console.log(showAp, " en exportar servicio");
      worksheet.columns = [
        { header: "Nombre del servicio medico", key: "serviceName", width: 30 },
        { header: "Responsable", key: "responsible", width: 20 },
        { header: "Tipo de Pago", key: "paymentType", width: 20 },
        { header: "Costo del servicio", key: "serviceCost", width: 20 },
        {
          header: "Fecha de extracción de reporte",
          key: "fechaExtraccion",
          width: 30,
        },
      ];

      data.forEach((item) => {
        worksheet.addRow({
          serviceName: item["Nombre del servicio medico"],
          responsible: item["Responsable"],
          paymentType: item["Tipo de Pago"],
          serviceCost: item["Costo del servicio"],
          fechaExtraccion: currentDate,
        });
      });

      // Calcular total de ingresos
      const totalIngresoService = data.reduce(
        (sum, item) => sum + (parseFloat(item["Costo del servicio"]) || 0),
        0
      );

      // Agregar fila con el total
      const totalRowService = worksheet.addRow({
        serviceName: "Total Ingreso",
        serviceCost: totalIngresoService.toFixed(2),
      });

      // Aplicar estilo a la celda del total
      totalRowService.getCell("serviceCost").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF00" },
      };

      break;
    case "ct":
      console.log(data);
      worksheet.columns = [
        { header: "Nombre del Doctor", key: "doctor", width: 30 },
        { header: "Responsable", key: "responsable", width: 25 },

        { header: "Cantidad de aporte", key: "contributionAmount", width: 20 },
        { header: "Fecha del aporte", key: "fechaExtraccion", width: 25 },
        { header: "Glosa del aporte", key: "gloss", width: 25 },
        { header: "Tipo de Pago", key: "paymentType", width: 20 },
      ];

      data.forEach((item) => {
        worksheet.addRow({
          doctor: item["Nombre del doctor"],
          responsable: item["Responsable"],
          contributionAmount: parseFloat(item["Cantidad de aporte"]) || 0,
          fechaExtraccion: formatDate(item["Fecha del aporte"]),
          gloss: item["Glosa de aporte"],
          paymentType: item["Tipo de Pago"],
        });
      });

      // Calcular total de ingresos
      const contributionTotal = data.reduce(
        (sum, item) => sum + (parseFloat(item["Cantidad de aporte"]) || 0),
        0
      );

      // Agregar fila con el total
      const totalRowContribution = worksheet.addRow({
        especialidad: "Total Ingreso",
        contributionAmount: contributionTotal.toFixed(2),
      });

      totalRowContribution.getCell("contributionAmount").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF00" },
      };
      break;
    default:
      console.log("Valor no válido para showAp");
  }

  // Generar y descargar el archivo Excel
  workbook.xlsx
    .writeBuffer()
    .then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName.replace(".xlsx", `_${currentDate}.xlsx`);
      link.click();
    })
    .catch((error) => {
      console.error("Error al generar el archivo Excel:", error);
    });
};




const exportToPDF = (data, showAp, fileName = "reporte_medico.pdf") => {
  const doc = new jsPDF("p", "pt", "letter"); // p=portrait, letter = hoja carta
  const currentDate = new Date().toLocaleDateString("es-ES");

  let columns = [];
  let rows = [];
  let totalIngreso = 0;

  switch (showAp) {
    case "ap":
      columns = [
        "Especialidad",
        "Nombre del Doctor",
        "Tipo de Consulta",
        "Responsable",
        "Porcentaje de Descuento Aplicado",
        "Costo de la Consulta",
        "Descripción del Convenio",
        "Fecha de Extracción",
        "Tipo de Pago",
      ];

      rows = data.map((item) => {
        const costo = parseFloat(item["Costo de la Consulta"]) || 0;
        totalIngreso += costo;
        return [
          item["Especialidad"],
          item["Nombre del doctor"],
          item["Tipo de consulta"],
          item["Responsable"],
          item["Porcentaje de descuento aplicado"],
          costo.toFixed(2),
          item["Descripcion del convenio"],
          currentDate,
          item["Tipo de Pago"],
        ];
      });

      // Fila total
      rows.push([
        "Total Ingreso", "", "", "", "", totalIngreso.toFixed(2), "", "", "",
      ]);
      break;

    case "sv":
      columns = [
        "Nombre del servicio medico",
        "Responsable",
        "Tipo de Pago",
        "Costo del servicio",
        "Fecha de extracción de reporte",
      ];

      rows = data.map((item) => {
        const costo = parseFloat(item["Costo del servicio"]) || 0;
        totalIngreso += costo;
        return [
          item["Nombre del servicio medico"],
          item["Responsable"],
          item["Tipo de Pago"],
          costo.toFixed(2),
          currentDate,
        ];
      });

      rows.push(["Total Ingreso", "", "", totalIngreso.toFixed(2), ""]);
      break;

    case "ct":
      columns = [
        "Nombre del Doctor",
        "Responsable",
        "Cantidad de aporte",
        "Fecha del aporte",
        "Glosa del aporte",
        "Tipo de Pago",
      ];

      rows = data.map((item) => {
        const aporte = parseFloat(item["Cantidad de aporte"]) || 0;
        totalIngreso += aporte;
        return [
          item["Nombre del doctor"],
          item["Responsable"],
          aporte.toFixed(2),
          item["Fecha del aporte"],
          item["Glosa de aporte"],
          item["Tipo de Pago"],
        ];
      });

      rows.push(["Total Ingreso", "", totalIngreso.toFixed(2), "", "", ""]);
      break;

    default:
      console.error("Valor no válido para showAp");
      return;
  }

  // Título y fecha
  doc.setFontSize(16);
  doc.text("Reporte Médico", 40, 40);
  doc.setFontSize(10);
  doc.text(`Fecha de extracción: ${currentDate}`, 40, 60);

  // Generar tabla
  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: 80,
    styles: { fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: [41, 128, 185] }, // azul para cabecera
  });

  // Descargar PDF
  doc.save(fileName.replace(".pdf", `_${currentDate}.pdf`));
};

export { fetchAppointments, exportToExcel, procesDataForDetailRp, fetchReport ,exportToPDF};
