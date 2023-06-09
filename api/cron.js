require('dotenv').config()
const LOLEROS = require('../constants.js')
const { LolerosRacha, LolerosRecord } = require('../models/lolerosRacha')
const axios = require('axios')

const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.50",
    "Accept-Language": "es-419,es;q=0.9,es-ES;q=0.8,en;q=0.7,en-GB;q=0.6,en-US;q=0.5",
    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
    "X-Riot-Token": process.env.X_RIOT_TOKEN    
}

const valorRachaMaxima = async() => {
    const result = await LolerosRecord.find({});
    return result[0].racha
}

const racha = async (lolero, numPartidas, rachamaxima) =>{
    let cantidadDerrotas = 0;
    for (const numPartida of numPartidas) {
        await delay(2500);
        const response = await axios.get(`https://${lolero.region}.api.riotgames.com/lol/match/v5/matches/${numPartida}`,{
            headers: headers
        })
        if (response.data.metadata.participants.indexOf(lolero.puuid) < 5){
            if(response.data.info.teams[0].win){
                console.log(cantidadDerrotas)
                console.log(lolero.nombre)
                if (cantidadDerrotas > rachamaxima){
                    rachamaxima = cantidadDerrotas
                    const record = {
                        racha: rachamaxima,
                        nombre: lolero.nombre,
                        foto: lolero.foto
                    }
                    await LolerosRecord.findByIdAndUpdate(lolero.id, record, {new: true})
                    .then(updatedNote => {
                        console.log(updatedNote)
                      })
                }
                const racha = {
                    nombre: lolero.nombre,
                    racha: cantidadDerrotas,
                    puuid: lolero.puuid,
                    foto: lolero.foto
                }
                await LolerosRacha.findByIdAndUpdate(lolero.id, racha, { new: true }) 
                .then(updatedNote => {
                    console.log(updatedNote)
                  })
                break
            } else {
                cantidadDerrotas++
            }
        } else {
            if(response.data.info.teams[0].win){
                cantidadDerrotas++
            } else {
                console.log(cantidadDerrotas)
                console.log(lolero.nombre)
                if (cantidadDerrotas > rachamaxima){
                    rachamaxima = cantidadDerrotas
                    const record = {
                        racha: rachamaxima,
                        nombre: lolero.nombre,
                        foto: lolero.foto
                    }
                    await LolerosRecord.findByIdAndUpdate(lolero.id, record, {new: true})
                    .then(updatedNote => {
                        console.log(updatedNote)
                      })
                }
                const racha = {
                    nombre: lolero.nombre,
                    racha: cantidadDerrotas,
                    puuid: lolero.puuid,
                    foto: lolero.foto
                }
                await LolerosRacha.findByIdAndUpdate(lolero.id, racha, { new: true })
                .then(updatedNote => {
                    console.log(updatedNote)
                  })
                break
            }
        }
    }
}

const partidas = async () => {
    let rachamaxima = await valorRachaMaxima()
    console.log(rachamaxima)
    for(const lolero of LOLEROS) {
        await delay(2500);
    const response = await axios.get(`https://${lolero.region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${lolero.puuid}/ids?start=0&count=50`,{
        headers: headers
    })
    const numPartidas = response.data
    await racha(lolero, numPartidas, rachamaxima)
    }
}

const delay = ms => new Promise(res => setTimeout(res, ms));

partidas()