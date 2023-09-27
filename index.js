import bodyParser from "body-parser";
import express from "express";
import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 3000;
const apiKey = process.env.API_KEY;

const data = new Date();
const hora = data.getHours();
const min = data.getMinutes();

function kelForCel(kevin) {
    const celsius = kevin - 273.15;
    return celsius.toFixed(2);
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.render('index2.ejs');
});

app.post("/clima", async (req, res) => {
    const cidade = req.body.nomeCidade;
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}`;
    try {
        const result = await axios.get(API_URL);
        var temp = result.data.main.temp;
        const pais = result.data.sys.country;
        var tempMin = result.data.main.temp_min;
        var tempMax = result.data.main.temp_max;
        const umidade = result.data.main.humidity;
        const tempo = result.data.weather[0].main;

        temp = kelForCel(temp);
        tempMin = kelForCel(tempMin);
        tempMax = kelForCel(tempMax);

        res.render("index.ejs", {
            cidade: cidade,
            pais: pais,
            temp: temp,
            umd: umidade,
            tempo: tempo,
            horas: hora, 
            min: min,
            clima: tempo,
            mini: tempMin,
            max: tempMax,
            conteudo: JSON.stringify(result.data)
        });
        console.log(`Dados recebidos da API:`, result.data);
    } catch (error) {
        console.log(error);
        res.status(500).send("Erro na busca de dados");
    }
});

app.listen(port, () => {
    console.log(`Server rodando na porta ${port}`);
});