const express = require('express')
const app = (express())
const PORT = 3000
const cors = require('cors')

app.use(cors())
app.use(express.json())

const personas = []

app.get('/personas', (req,res) => {

    res.status(200).json(personas)
})

app.get('/personas/:id', (req,res) => {
    const idx = personas.findIndex(p => p.id == req.params.id)

    if(idx>=0){
        res.status(200).json(personas[idx])
    }else{
        res.status(404).json({mensaje: `No se encontró a la persona ${req.params.id}`})
    }
})

app.delete('/personas/:id', (req,res) => {
    const idx = personas.findIndex(p => p.id == req.params.id)

    if(idx>=0){
        personas.splice(idx,1)
        res.status(200).json({mensaje: `Se elimino a ${personas[idx]}`})
    }else{
        res.status(404).json({mensaje: `No se encontró a la persona ${req.params.id}`})
    }
})

app.post('/personas', (req,res) => {

    const ids = personas.map(p => p.id)
    const id = Math.max(...ids)

    const persona = {
        id: personas.length == 0 ? 1 : id+1,
        dni: req.body.dni,
        apellido:req.body.apellido,
        nombre:req.body.nombre,
        edad:req.body.edad,
        registro: false,
        domicilio: {
            calle: req.body.domicilio.calle,
            numero: req.body.domicilio.numero,
            localidad: req.body.domicilio.localidad
        }}


        const existe = personas.map(p => p.dni).includes(persona.dni)
        const dni = persona.dni < 0 || persona.dni > 99999999
        const edad = persona.edad < 1 || persona.edad > 99
    
        if(existe){
            res.status(400).json({mensaje: `La persona con DNI ${persona.dni} ya existe`})
            if(edad){
                res.status(400).json({mensaje: `La edad ingresada: ${persona.edad} es invalida. Por favor ingrese un valor entre 1 y 99 inclusive`})
            }if(dni){
                res.status(400).json({mensaje: `El DNI: ${persona.dni} no es valido. Por favor ingrese un valor entre 0 y 99.999.999 inclusive`})
            }
        }else{
            personas.push(persona)
            res.status(201).json(personas)
        }
})



app.put('/personas', (req,res) => {
    const id = req.body.id
    const idx = personas.findIndex(p => p.id == id)

    if(idx>=0){
        persona = personas.find(p => p.id == id)
        persona.registro = req.body.registro
        persona.domicilio.calle = req.body.domicilio.calle
        persona.domicilio.numero = req.body.domicilio.numero
        persona.domicilio.localidad = req.body.domicilio.localidad

        personas.splice(idx,1,persona)
        res.status(200).json(personas[idx])
    }else{
        res.status(404).json({mensaje: `No se pudieron modificar los datos porque encontró a la persona ${req.params.id}`})
    }
})



app.listen(PORT,() =>{
    console.log(`La aplicación arrancó en el puerto ${PORT}`)
})
