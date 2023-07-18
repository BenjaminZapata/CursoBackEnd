import bcrypt from 'bcrypt'

export const createHash = async ( password ) => {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

export const passwordValidation = async ( user, password ) => {
    return bcrypt.compare(password, user.password)
}