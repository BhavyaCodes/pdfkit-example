const express = require('express')
const PDFDocument = require('pdfkit')
const path = require('path')
const fs = require('fs')
const uuid = require('uuid')
const { end } = require('pdfkit')

const port = process.env.PORT || 3000

const app = express()

app.use(express.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname,"public")))

app.get('/',(req,res)=>{
    res.sendFile('index.html')
})

app.post('/formsubmit', async (req,res)=>{
    try{
        const fileName = uuid.v1()
        const filePath = path.join(__dirname, "temp",fileName)
        const pdfDoc = new PDFDocument()
        res.setHeader('Content-Type','application/pdf')
        res.setHeader('Content-Diposition',`inline; filename = ${req.body.name}`)
        pdfDoc.pipe(fs.createWriteStream(filePath))
        pdfDoc.pipe(res)
        pdfDoc.fontSize(24).text(`Hello ${req.body.name}`)
        pdfDoc.fontSize(32).text('You are awesome!')
        await pdfDoc.end()
        fs.unlink(filePath,(err)=>{
            if(err){
                console.log(err)
                throw (err)
            }
        })
    } catch(e){
        console.log(e)
    }
})

app.use((req,res)=>{
    res.send('page not found')
})
app.listen(port, ()=>{
    console.log(`app running on ${port}`)
})