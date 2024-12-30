import { NextResponse } from "next/server";
import { neon_sql } from "@/app/lib/neon";

export async function GET(request, { params }) {
  try {
    console.log("LO que hay en get one", params.id);
    const { searchParams } = new URL(request.url);
    const isActivate = searchParams.get("isactivate");
    const email = params.id;
    let query;
    if (isActivate) {
      query = `SELECT verified_account FROM users WHERE email=$1`;
    } else {
      query = `SELECT * FROM users WHERE email=$1`;
    }
    const userFound = await neon_sql(query, [email]);
    console.log("La respuesta que tiene db", NextResponse.json(userFound));
    return NextResponse.json(userFound);
  } catch (error) {
    console.error("Error al consultar la base de datos:", error);
    return NextResponse.json(
      { error: "Error al obtener los datos" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const email = params.id;
    console.log("el email", email);
    const query = `
      UPDATE users
      SET
        verified_account = COALESCE($2, verified_account)
      WHERE email = $1
      RETURNING *;
    `;
    const response = await neon_sql(query, [email, true]);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error al consultar la base de datos:", error);
    return NextResponse.json(
      { error: "Error al actualizar los datos" },
      { status: 500 }
    );
  }
}
