import nodemailer from "nodemailer"
import Mailgen from "mailgen"
import { gmailPass, gmailUser } from "../config/main.config.js"

export const sendRecoverEmail = async ( email, recoverCode ) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailPass
    }
  })
  let mailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: "Tienda online",
      link: "http://127.0.0.1:8080/"
    }
  })
  let response = {
    body: {
      intro: "Codigo de recuperacion de cuenta",
      outro: `Hola, su codigo es ${recoverCode}. Recuerda que tienes una hora para utilizarlo`
    }
  }
  let mail = mailGenerator.generate(response)
  let message = {
    from: gmailUser,
    to: email,
    subject: "Recuperar cuenta",
    html: mail
  }
  try {
    const info = await transporter.sendMail(message)
  } catch (err) {
    console.log(err)
  }
}