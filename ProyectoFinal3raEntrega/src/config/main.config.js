import dotenv from 'dotenv'

dotenv.config()

export const serverPort = process.env.SERVER_PORT
export const mongoURL = process.env.MONGO_URL
export const githubClientID = process.env.GITHUB_CLIENT_ID
export const githubClientSecret = process.env.GITHUB_CLIENT_SECRET