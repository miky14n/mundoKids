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
        ORDER BY full_name ASC
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
    const {
      doctor_id,
      gloss,
      date,
      amount_contributed,
      responsible,
      payment_type,
    } = body;

    if (!doctor_id) {
      return NextResponse.json(
        { error: "El campo 'doctor_id' es obligatorio." },
        { status: 400 }
      );
    }
    const result = await neon_sql`
        INSERT INTO contributions (doctor_id, date,gloss ,amount_contributed, responsible, payment_type)
        VALUES (
          ${doctor_id},
          ${date}, 
          ${gloss || null},
          ${amount_contributed} ,
          ${responsible || null},
          ${payment_type || "Efectivo"}
        )
        RETURNING *;
      `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error al insertar la contribución:", error);
    return NextResponse.json(
      { error: "Error al crear la contribución. Inténtalo de nuevo." },
      { status: 500 }
    );
  }
}
