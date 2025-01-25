import { NextResponse } from "next/server";
import { neon_sql } from "@/app/lib/neon";
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const patient_id = searchParams.get("id");
    const filter = searchParams.get("filter");
    let query = `SELECT * FROM medical_appointment`;
    const conditions = [];

    if (date) {
      conditions.push(`date = '${date}'`);
    }
    if (patient_id) {
      conditions.push(`patient_id = ${patient_id}`);
    }
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
          conditions.push(`date = '${todayDate}'`);
          break;
        case "week":
          conditions.push(
            `date >= NOW()::DATE - EXTRACT(DOW FROM NOW())::INTEGER AND date < NOW()::DATE + (7 - EXTRACT(DOW FROM NOW())::INTEGER)`
          );
          break;
        case "month":
          conditions.push(
            `DATE_PART('month', date) = ${
              now.getMonth() + 1
            } AND DATE_PART('year', date) = ${now.getFullYear()}`
          );
          break;
        case "year":
          conditions.push(`DATE_PART('year', date) = ${now.getFullYear()}`);
          break;
        default:
          throw new Error("Filtro inválido");
      }
    }
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
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

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      patient_id,
      ci,
      type_of_appointment,
      specialty_id,
      doctor_id,
      date,
      height,
      weight,
      temperature,
      responsible,
    } = body;
    if (
      !patient_id ||
      !ci ||
      !type_of_appointment ||
      !specialty_id ||
      !doctor_id ||
      !date
    ) {
      return NextResponse.json(
        {
          error:
            "Los campos 'patient_id', 'ci', 'type_of_appointment', 'specialty_id', 'doctor_id' y 'date' son obligatorios.",
        },
        { status: 400 }
      );
    }

    // Inserción en la base de datos
    const result = await neon_sql`
      INSERT INTO medical_appointment (
        patient_id,
        ci,
        type_of_appointment,
        specialty_id,
        doctor_id,
        date,
        height,
        weight,
        temperature,
        responsible
      ) VALUES (
        ${patient_id},
        ${ci || 0},
        ${type_of_appointment},
        ${specialty_id},
        ${doctor_id},
        ${date},
        ${height || null},
        ${weight || null},
        ${temperature || null},
        ${responsible || null}
      )
      RETURNING *;
    `;
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error al insertar la cita médica:", error);
    return NextResponse.json(
      { error: "Error al crear la cita médica. Inténtalo de nuevo." },
      { status: 500 }
    );
  }
}
