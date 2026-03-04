const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

let token = "";
let tokenExpira = 0;

async function obtenerToken() {
    const response = await axios.post(
        "https://apoyo.sics.com.co/SICS360/api/InicioSesion/IniciarSesion",
        {
            Usuario: "ApoyoSICS ",
            Clave: "#Apoyo2024",
            Key: " j3iANSX9T5zDePV4aWBB5eCiVaVXrhayzqBGtwKHWRrmR37jbb "
        }
    );

    token = response.data.Access;
    tokenExpira = Date.now() + 25 * 60 * 1000;
}

app.post("/consultar", async (req, res) => {
    try {

        if (!token || Date.now() > tokenExpira) {
            await obtenerToken();
        }

        const response = await axios.post(
            "https://apoyo.sics.com.co/SICS360/api/ConsultarCartera/ConsultarCarteraCliente",
            {
                DocumentoCliente: req.body.documento
            },
            {
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json(response.data);

    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: "Error consultando cartera" });
    }
});

app.listen(3000, () => {
    console.log("Servidor listo en http://localhost:3000");
});