import { NextResponse } from "next/server";
import { neon_sql } from "@/app/lib/neon";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter");

    let query = `
          SELECT 
              msv.medical_srv_id AS ID,
              msv.date,
              msv.responsible,
              msv.service_cost,
              msv.payment_type,
              sv.name AS services_name
          FROM medical_services msv
          INNER JOIN services sv ON msv.services_id = sv.services_id
      `;

    const conditions = [];
    console.log(filter, "el filtro");

    if (filter) {
      const now = new Date();
      const boliviaOffset = -4 * 60; // Offset en minutos para GMT-4
      const localNow = new Date(now.getTime() + boliviaOffset * 60 * 1000);

      const todayDate = `${localNow.getFullYear()}-${(localNow.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${localNow.getDate().toString().padStart(2, "0")}`;

      switch (filter) {
        case "today":
          conditions.push(`msv.date = '${todayDate}'`);
          break;
        case "week":
          conditions.push(`
              msv.date >= DATE_TRUNC('week', NOW())::DATE 
              AND msv.date < DATE_TRUNC('week', NOW())::DATE + INTERVAL '7 days'
            `);
          break;
        case "month":
          conditions.push(`
              msv.date >= DATE_TRUNC('month', NOW())::DATE 
              AND msv.date < DATE_TRUNC('month', NOW())::DATE + INTERVAL '1 month'
            `);
          break;
        case "year":
          conditions.push(`
              msv.date >= DATE_TRUNC('year', NOW())::DATE 
              AND msv.date < DATE_TRUNC('year', NOW())::DATE + INTERVAL '1 year'
            `);
          break;
        default:
          throw new Error("Filtro inválido");
      }
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += ` ORDER BY sv.name ASC;`; // Asegurar que siempre haya un ORDER BY

    console.log("Query ejecutado:", query);

    const result = await neon_sql(query);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error en la consulta:", error);
    return new Response(
      JSON.stringify({
        error: "Error al obtener los datos.",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
