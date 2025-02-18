import { NextResponse } from "next/server";
import { neon_sql } from "@/app/lib/neon";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  console.log("que tiene sesion para el usuario", session);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const full_name = searchParams.get("full_name");
    const email = searchParams.get("tofind");
    let query;
    if (full_name) {
      query = neon_sql`
        SELECT 
          doctor.*, 
          CONCAT(doctor.name, ' ', doctor.last_name) AS full_name 
        FROM doctor
      `;
    } else {
      query = neon_sql`
        SELECT * FROM doctor
      `;
    }
    if (email) {
      query = neon_sql`SELECT doctor_id FROM doctor WHERE email = ${email}`;
    }

    const doctors = await query;
    return NextResponse.json(doctors);
  } catch (error) {
    console.error("Error al consultar la base de datos:", error);
    return NextResponse.json(
      { error: "Error al obtener los datos" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, last_name, ci, contact_number, email, hire_date } = body;
    const specialty_id = body.valueExtraComponent;
    console.log(body, "El bd", specialty_id);
    if (!name || !last_name) {
      return NextResponse.json(
        { error: "Los campos 'name', 'last_name' y 'ci' son obligatorios." },
        { status: 400 }
      );
    }
    const result = await neon_sql`
      INSERT INTO doctor (name,specialty_id, last_name, ci, contact_number, email, hire_date)
      VALUES (
        ${name},
        ${specialty_id},
        ${last_name},
        ${ci},
        ${contact_number || "N/A"},
        ${email || "N/A"},
        ${hire_date || new Date()}
      )
      RETURNING *;
    `;
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error al insertar el doctor:", error);
    return NextResponse.json(
      { error: "Error al crear el doctor. Inténtalo de nuevo.", error },
      { status: 500 }
    );
  }
}
