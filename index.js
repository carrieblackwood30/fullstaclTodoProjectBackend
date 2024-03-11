const express = require("express")
const uuid = require("uuid")
const app = express()
const cors = require("cors")
const fs = require('fs')

const PORT = 3000

app.use(express.json())
app.use(cors())

const todos = []

const data = fs.readFileSync("./data-base.json", { encoding: 'utf8' })
const dataParse = JSON.parse(data)

app.get("/", (req, res) => {
    res.json(dataParse)
})

app.get("/todos", (req, res) => {
    res.json(dataParse)
})

app.get("/todos/:id", (req, res) => {
    let todo = todos.find((todo) => todo.id == req.params.id)

    if (!todo) {
        res.sendStatus(404)
        return
    }

    res.json(todo)
})

app.post("/todos", (req, res) => {
    console.log(req.body)
    dataParse.push({ id: uuid.v4(), ...req.body })
    res.json({ msg: "Add Todo", data: dataParse })

    fs.writeFile("data-base.json", JSON.stringify(dataParse), (err) => {
        if (err) throw err
        console.log('done')
    })
})

app.put("/todos/:id", (req, res) => {
    let todo = dataParse.find((todo) => todo.id == req.params.id)
    if (todo) {
        todo.name = req.body.name
        todo.status = req.body.status
        res.json({ msg: "edit todo", data: dataParse })
    } else {
        res.json({ msg: "todo doesn't exist" })
    }

    fs.writeFile("data-base.json", JSON.stringify(dataParse), (err) => {
        if (err) throw err
        console.log('done')
    })
})

app.delete("/todos/:id", (req, res) => {
    let index = dataParse.findIndex((todo) => todo.id == req.params.id)
    dataParse.splice(index, 1)
    res.json({ msg: "Delete Todo", data: dataParse });

    fs.writeFile("data-base.json", JSON.stringify(dataParse), (err) => {
        if (err) throw err
        console.log('done')
    })
})

app.listen(PORT, () => {
    console.log(`app is running on ${PORT}`)
})