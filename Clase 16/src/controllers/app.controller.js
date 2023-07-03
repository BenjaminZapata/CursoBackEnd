import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import Mailgen from 'mailgen'
dotenv.config()

export const signup = async (req, res) => {
  let testAccount = await nodemailer.createTestAccount()
  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: testAccount.user,
        pass: testAccount.pass
    }
  })
  let message = {
    from: "Benjamin Zapata <benjaminzapata1998@gmail.com>",
    to: 'benjaminzapata1998@gmail.com',
    subject: "Nuevo usuario registrado",
    html: "<h2>Bienvenido</h2>"
  }

  try{
    const info = await transporter.sendMail(message)
    res.status(201).json({ 
      message: "Email enviado..",
      preview: nodemailer.getTestMessageUrl(info)
    })
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
}

export const getbill = async (req, res) => {
  const emailUser = req.body.email
  let config = {
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  }
  let transporter = nodemailer.createTransport(config)
  let mailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: "Mailgen",
      link: "http://www.coderhouse.com"
    }
  })
  let response = {
    body: {
      intro: "Your bill has arrived",
      table: {
        data: [
          {
            item: 'Bicicleta de 2 ruedas',
            description: 'Linda bicicleta para bicicletear',
            price: "USD 10.99"
          }
        ]
      },
      outro: "Lookin forward to do more bussiness..."
    }
  }
  let mail = mailGenerator.generate(response)
  let message = {
    from: process.env.GMAIL_USER,
    to: emailUser,
    subject: "Boleta de pago",
    html: mail
  }
  try{
    await transporter.sendMail(message)
    res.status(201).json({ 
      message: "Email enviado.."
    })
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
}