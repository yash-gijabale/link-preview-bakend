const express = require('express')
const dotenv = require('dotenv')
const fetch = require('node-fetch')
const cheerio = require('cheerio');

dotenv.config()

const app = express()

app.set('view engine', 'ejs')
app.use(express.json())

const allowCros = (req, res, next) => {
    res.header(`Access-Control-Allow-Origin`, `*`);
    res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
    res.header(`Access-Control-Allow-Headers`, `Content-Type`);
    next();
}

app.use(allowCros)

app.post('/preview', async(req, res) => {
    try {
        const body = req.body
        const data = await fetch(body.url)
        const html = await data.text()
        const $ = cheerio.load(html);
        const title = $('meta[property="og:title"]').attr('content') || $('title').text() || $('meta[name="title"]').attr('content')
        const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content')
        const url = $('meta[property="og:url"]').attr('content')
        const image = $('meta[property="og:image"]').attr('content') || $('meta[property="og:image:url"]').attr('content')
        let fileData = {
            title,
            description,
            url,
            image,
        }
        res.render('link', fileData, (err, html) => {
            res.json({ data: html })
        })
    } catch (error) {
        res.status(404).json({
            error:'Somthing is swrong'
        })
    }
})

app.use((req, res) => {
    res.send('Hello')
})

app.listen(process.env.PORT || 3000, () => {
    console.log('Listing on post 3000')
})