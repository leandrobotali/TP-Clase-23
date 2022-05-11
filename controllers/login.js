const renderLogin = (req,res) => {
    console.log(req.session.user);
    if (req.session.user) {
        res.send(req.app.io.sockets.emit("bienvenido", req.session.user))
    }
}

const login = (req,res) => {
    const { nombre } = req.body
    req.session.user = nombre
    console.log(req.session.user);
    res.send(req.app.io.sockets.emit("bienvenido", req.session.user))
    // res.redirect('/')
}


module.exports = {renderLogin, login}