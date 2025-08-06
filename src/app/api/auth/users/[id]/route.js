import { NextResponse } from "next/server";
import { neon_sql } from "@/app/lib/neon";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { ok } from "assert";
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
export async function DELETE(request, { params }) {
  try {
    const user_id = params.id;
    console.log("el email", user_id);
    const query = `
      DELETE FROM users
      WHERE user_id = $1;
    `;
    const response = await neon_sql(query, [user_id]);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error al consultar la base de datos:", error);
    return NextResponse.json(
      { error: "Error al actualizar los datos" },
      { status: 500 }
    );
  }
}
export async function PUT(request, { params }) {
  try {
    const user_id = params.id;
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const generateRandomPassword = () => {
      return crypto
        .randomBytes(3)
        .toString("base64")
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 5);
    };
    const generatedPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash( generatedPassword, 10);
    console.log("El pass hash", hashedPassword, "user id",);
    const query = `
      UPDATE users
      SET password = $1
      WHERE user_id = $2;
    `;
    const response = await neon_sql(query, [hashedPassword, user_id]);
    const personalSubject = "Restauración de contraseña";
    const personalMessage = "Clinica Mundo Kids restauracion de contraseña";
    if (response && email) {
      console.log("Entre if", response);
      try {
       const baseUrl = request.nextUrl.origin; 
      await fetch(`${baseUrl}/api/send`, {
          method: "POST",
          body: JSON.stringify({
            password: generatedPassword,
            email,
            personalSubject,
            personalMessage,
          }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (emailError) {
      console.error("Error al enviar correo:", emailError.message);
    }
      return NextResponse.json({
        success: true,
        message: "Contraseña restablecida",
        data: response,
      });
    }
    else{
      console.log("no Entre if", response);
      return NextResponse.json({success: false,
        message: "Contraseña No restablecida",
        data: response,})
    }

  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    return NextResponse.json(
      { error: "Error al restablecer la contraseña" },
      { status: 500 }
    );
  }
}
