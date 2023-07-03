import { userService } from "../services/index.js"

const getUsers = async(req, res) => {
  let result = await userService.get()
  res.send(result)
}

const saveUser = async(req, res) => {
  let user = req.body
  let result = await userService.save(user)
  res.send(result)
}

export default { getUsers, saveUser }