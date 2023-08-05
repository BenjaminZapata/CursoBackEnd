import dotenv from 'dotenv'

dotenv.config()

export const serverPort = process.env.SERVER_PORT
export const mongoURL = process.env.MONGO_URL
export const githubClientID = process.env.GITHUB_CLIENT_ID
export const githubClientSecret = process.env.GITHUB_CLIENT_SECRET
export const persistence = process.env.PERSISTENCE
export const gmailUser = process.env.GMAIL_USER
export const gmailPass = process.env.GMAIL_PASS