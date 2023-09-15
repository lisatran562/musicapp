const UserController = require('../controllers/user.controller')
const {authenticate} = require('../configs/jwt.config')

module.exports = (app) => {

    app.get('/api/users', authenticate, UserController.getAllUsers)
    app.post(`/api/users/register`, UserController.register)
    app.post(`/api/users/login`, UserController.login)
    app.get(`/api/users/getloggedinuser`, UserController.getLoggedInUser)
    app.put('/api/users/:id', UserController.updateUser)
    app.get(`/api/users/logout`, UserController.logout)


}