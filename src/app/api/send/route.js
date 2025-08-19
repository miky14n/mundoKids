import nodemailer from "nodemailer";

export async function POST(request,) {
  const data = await request.json();
const { email, password } = data;
const personalSubject=data.personalSubject||"Creación de cuenta";
const personalMessage=data.personalMessage||"Bienvenido a Mundokids";
console.log("Llegada al envio de correo", personalSubject);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_TO_SENDER,
      pass: process.env.PASS_APLICATION,
    },
  });

  const mailOptions = {
    from: "mundokidsit@gmail.com",
    to: email,
    subject: personalSubject,
    html: `
      <html>
        <body>
          <h1>${personalMessage}</h1>
          <p>Tu contraseña generada es: <strong>${password}</strong></p>
        </body>
      </html>
    `,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado:", info.response);
    return new Response("Correo enviado exitosamente", { status: 200 });
  } catch (error) {
    console.error("Error enviando el correo:", error);
    return new Response("Error enviando el correo", { status: 500 });
  }
}
