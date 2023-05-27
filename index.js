const axios = require('axios')
require('dotenv').config()
const LOLEROS = require('./constants.js')
const LolerosRacha = require('./models/lolerosRacha')
const express = require('express')
const app = express()

const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.50",
    "Accept-Language": "es-419,es;q=0.9,es-ES;q=0.8,en;q=0.7,en-GB;q=0.6,en-US;q=0.5",
    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
    "X-Riot-Token": process.env.X_RIOT_TOKEN    
}


const racha = async (puuid, numPartidas) =>{
    let cantidadDerrotas = 0;
    for (const numPartida of numPartidas) {
        await delay(2500);
        const response = await axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/${numPartida}`,{
            headers: headers
        })
        if (response.data.metadata.participants.indexOf(puuid) < 5){
            if(response.data.info.teams[0].win){
                console.log(cantidadDerrotas)
                console.log(puuid)
                break
            } else {
                console.log("Perdio")
                cantidadDerrotas++
            }
        } else {
            if(response.data.info.teams[0].win){
                console.log("Perdio")
                cantidadDerrotas++
            } else {
                console.log(cantidadDerrotas)
                console.log(puuid)
                break
            }
        }
    }
}

const partidas = async (puuid) => {
    await delay(2500);
    const response = await axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=50`,{
        headers: headers
    })
    const numPartidas = response.data
    await racha(puuid, numPartidas)
}

const delay = ms => new Promise(res => setTimeout(res, ms));

const identificadores = async () => {
    for (const lolero of LOLEROS) {
        await delay(2500);
        const response = await axios.get(`https://la2.api.riotgames.com/lol/summoner/v4/summoners/by-name/${lolero}`,{
            headers: headers
        })
        const puuid = response.data.puuid
        await partidas(puuid);
    }
}

identificadores()

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
