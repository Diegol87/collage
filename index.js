const express = require('express')
const app = express()
const fs = require('fs')
const expressFileupload = require('express-fileupload')
const bodyParser = require('body-parser')

app.listen(3000, () => {
    console.log('Server ON')
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

app.use(expressFileupload({
    limits: { fileSize: 5000000 },
    abortOnLimit: true,
    responseOnLimit: "El peso del archivo que intentas subir supera el limite permitido"
}))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/formulario.html')
})

app.post('/imagen', (req, res) => {
    const { target_file } = req.files
    const { posicion } = req.body
    const name = `imagen-${posicion}`

    target_file.mv(`${__dirname}/public/imgs/${name}.jpg`, (err) => {
        res.redirect('/collage')
    })
})

app.use('/collage', (req, res) => {
    res.sendFile(__dirname + '/collage.html')
})

app.get('/deleteImg/:nombre', (req, res) => {
    const { nombre } = req.params
    fs.unlink(`${__dirname}/public/imgs/${nombre}`, (err) => {
        if(err) {
            console.log(err)
            return res.send('error al intentar eliminar')
        }
        return res.redirect('/collage')
    })
})



