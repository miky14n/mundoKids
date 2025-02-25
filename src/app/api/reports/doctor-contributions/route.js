import { NextResponse } from "next/server";
import { neon_sql } from "@/app/lib/neon";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter");

    let query = `
        SELECT 
          co.contribution_id AS ID,
          co.date,
          co.responsible,
          co.amount_contributed,
          co.gloss,
          co.payment_type,
          d.name || ' ' || d.last_name AS doctor_full_name,
          d.contact_number AS doctor_contact,
          d.email AS doctor_email
        FROM contributions co
        INNER JOIN doctor d ON co.doctor_id = d.doctor_id
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
          conditions.push(`co.date = '${todayDate}'`);
          break;
        case "week":
          conditions.push(
            `co.date >= NOW()::DATE - EXTRACT(DOW FROM NOW())::INTEGER 
              AND co.date < NOW()::DATE + (7 - EXTRACT(DOW FROM NOW())::INTEGER)`
          );
          break;
        case "month":
          conditions.push(
            `DATE_PART('month', co.date) = ${now.getMonth() + 1} 
              AND DATE_PART('year', co.date) = ${now.getFullYear()}`
          );
          break;
        case "year":
          conditions.push(`DATE_PART('year', co.date) = ${now.getFullYear()}`);
          break;
        default:
          throw new Error("Filtro inválido");
      }
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(
        " AND "
      )} ORDER BY doctor_full_name ASC`;
    }

    const medical_appointment = await neon_sql(query);
    return NextResponse.json(medical_appointment);
  } catch (error) {
    console.error("Error al consultar la base de datos:", error);
    return NextResponse.json(
      { error: "Error al obtener los datos" },
      { status: 500 }
    );
  }
}
