import { NextResponse } from "next/server";
import { neon_sql } from "@/app/lib/neon";
import bcrypt from "bcrypt";
import crypto from "crypto";

export async function POST(request) {
  try {
    const data = await request.json();
    const {
      email,
      password,
      user_name,
      active_account,
      verified_account,
      valueExtraComponent,
    } = data;
    const role = valueExtraComponent?.key; 
    if (!role) {
      return NextResponse.json(
        {
          message: "Role is required",
        },
        {
          status: 400,
        }
      );
    }

    // Verificar si el correo ya existe
    const queryCheck = `SELECT * FROM users WHERE email = $1`;
    const userFound = await neon_sql(queryCheck, [email]);

    if (userFound.length > 0) {
      return NextResponse.json(
        {
          message: "Email already exists",
        },
        {
          status: 400,
        }
      );
    }

    // Generar contraseña aleatoria si no se proporciona
    const generateRandomPassword = () => {
      return crypto
        .randomBytes(3)
        .toString("base64")
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 5);
    };
    const generatedPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(password || generatedPassword, 10);


    // Insertar el nuevo usuario
    const queryInsert = `
      INSERT INTO users (user_name, email, password, verifi_password, role, active_account,verified_account) 
      VALUES ($1, $2, $3, $4, $5, $6,$7) RETURNING *`;
    const newUser = await neon_sql(queryInsert, [
      user_name,
      email,
      hashedPassword,
      hashedPassword,
      role,
      active_account || true,
      verified_account || false,
    ]);

    // Omitir el password del usuario en la respuesta
    const { password: _, ...user } = newUser[0];

    // Intentar enviar un correo (si se requiere)
    try {
      const baseUrl = request.nextUrl.origin; // Obtiene la base URL
      await fetch(`${baseUrl}/api/send`, {
        method: "POST",
        body: JSON.stringify({ password: generatedPassword, email }), // Enviar datos relevantes al endpoint de envío
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError.message);
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error:", error.message);
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
