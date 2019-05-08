const express = require('express');
const router = express.Router();
const socketServer = require('ws').Server;
const ss = new socketServer({port: 9000});
const Session = require('./modules/session')
let id = -1;
let clients = new Map;
let message = '';

router.get('/', (req, res) => {
    res.render('home.ejs');
})

router.post('/message', (req, res) => {
    message = req.body.message;
    res.redirect('/world');
})

ss.on('connection', conn => {
    id++;
    if(id >= 8){
        id = 0;
    }


   const session = new Session(id);
    clients.set(session.id, conn);

    clients.forEach(value => {
        value.send(message);
    })


    conn.on('close', () => {
        clients.delete(session.id);
    })

})


module.exports = router;
