import { NextResponse } from "next/server";
import { neon_sql } from "@/app/lib/neon";

export async function GET(request, { params }) {
  try {
    // Validar params.id
    if (!params.id) {
      throw new Error("Falta el parámetro de ID en la URL.");
    }

    const email = params.id;
    console.log("Email recibido:", email);

    // Parsear los parámetros de búsqueda
    const { searchParams } = new URL(request.url);
    const isActivate = searchParams.get("isactivate");

    let query;
    if (isActivate === "true") {
      query = `SELECT verified_account FROM users WHERE email=$1`;
    } else {
      query = `SELECT * FROM users WHERE email=$1`;
    }

    // Ejecutar la consulta SQL
    const userFound = await neon_sql(query, [email]);

    // Verificar si se encontró un usuario
    if (!userFound || userFound.length === 0) {
      return NextResponse.json(
        { error: "No se encontró un usuario con el correo proporcionado." },
        { status: 404 }
      );
    }

    // Responder con los datos del usuario
    console.log("Datos obtenidos de la base de datos:", userFound);
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
