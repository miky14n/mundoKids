import { NextResponse } from "next/server";
import { neon_sql } from "@/app/lib/neon";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const filter = searchParams.get("filter");
    const conditions = [];
    console.log;
    const patient_id = searchParams.get("id");
    let query = `SELECT * FROM medical_services`;
    if (date) {
      console.log(date);
      query += ` WHERE date = '${date}'`;
    } else if (patient_id) {
      query += ` WHERE patient_id = ${patient_id}`;
    }
    if (filter) {
      const now = new Date();
      const boliviaOffset = -4 * 60;
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
    const medical_services = await neon_sql(query);
    return NextResponse.json(medical_services);
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
    console.log(body);
    const {
      services_id,
      patient_id,
      responsible,
      status,
      temperature,
      weight,
      height,
      date,
      user_id,
      service_cost,
      payment_type,
    } = body;
    //corregir cuando se tenga a los usarios esto se debe enviar del body

    if (!services_id || !patient_id || !responsible) {
      return NextResponse.json(
        {
          error:
            "Los campos 'services_id', 'id_patient', 'responsible' y 'user_id' son obligatorios.",
        },
        { status: 400 }
      );
    }
    console.log("Los datos a guardar son:", body);
    const result = await neon_sql`
      INSERT INTO medical_services (
        services_id, 
        patient_id, 
        responsible, 
        status, 
        temperature, 
        weight, 
        height, 
        user_id,
        date,
        service_cost,
        payment_type
      )
      VALUES (
        ${services_id}, 
        ${patient_id}, 
        ${responsible}, 
        ${status || false}, 
        ${temperature || null}, 
        ${weight || null}, 
        ${height || null}, 
        ${user_id || null},
        ${date},
        ${service_cost || 0},
        ${payment_type || "Efectivo"}
        
      )
      RETURNING *;
    `;

    // Responder con el registro insertado
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error al insertar el servicio médico:", error);
    return NextResponse.json(
      { error: "Error al registrar el servicio médico. Inténtalo de nuevo." },
      { status: 500 }
    );
  }
}
