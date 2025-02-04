require('dotenv').config();
const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000 

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('index', {plants: null, message: null})
})

app.get('/getPlants', async (req, res) => {
    const params = req.query // all the form data
    const edible = params.edible === 'yes' ? '&edible=1' : ''
    const poisonous = params.pets_kids === 'yes' ? '&poisonous=0' : ''
    const cycle = params.lifespan ? '&cycle=' + params.lifespan : ''
    const watering = params.water_schedule ? '&watering=' + params.water_schedule : ''
    const sunlight = params.sunlight ? '&sunlight=' + params.sunlight : ''

    const apiUrl = `https://perenual.com/api/species-list?key=${process.env.PERENUAL_API_KEY}&indoor=1` + edible + poisonous + cycle + watering + sunlight

    try {
        console.log(apiUrl) 
        const response = await fetch(apiUrl)
        const data = await response.json()
        // filters paywall data
        const validData = data.data.filter(item => 
            !(item.cycle.includes('Upgrade')) || 
            item.watering.includes('Upgrade') || 
            item.sunlight.includes('Upgrade')
        )
    } catch {
        console.log('error', error)
        res.render('index', { plants: [], message: "Internal Server Error" })
    }
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost${PORT}`)
})