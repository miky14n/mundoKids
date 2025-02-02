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
    let query = neon_sql`
        SELECT user_id,user_name,role,active_account,email
        FROM users
      `;

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
