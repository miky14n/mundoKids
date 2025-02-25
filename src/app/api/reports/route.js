import { NextResponse } from "next/server";
import { neon_sql } from "@/app/lib/neon";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter");

    let query = `
      SELECT 
        ma.appoiment_id AS ID,
        ma.type_of_appointment,
        ma.date,
        ma.responsible,
        ma.appointment_price,
        ma.description_of_greement,
        ma.agreement_percent,
        ma.payment_type,
        s.name AS specialty_name,
        s.price AS specialty_price,
        d.name || ' ' || d.last_name AS doctor_full_name,
        d.contact_number AS doctor_contact,
        d.email AS doctor_email
      FROM medical_appointment ma
      INNER JOIN specialty s ON ma.specialty_id = s.specialty_id
      INNER JOIN doctor d ON ma.doctor_id = d.doctor_id
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
          conditions.push(`ma.date = '${todayDate}'`);
          break;
        case "week":
          conditions.push(
            `ma.date >= NOW()::DATE - EXTRACT(DOW FROM NOW())::INTEGER 
            AND ma.date < NOW()::DATE + (7 - EXTRACT(DOW FROM NOW())::INTEGER)`
          );
          break;
        case "month":
          conditions.push(
            `DATE_PART('month', ma.date) = ${now.getMonth() + 1} 
            AND DATE_PART('year', ma.date) = ${now.getFullYear()}`
          );
          break;
        case "year":
          conditions.push(`DATE_PART('year', ma.date) = ${now.getFullYear()}`);
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
