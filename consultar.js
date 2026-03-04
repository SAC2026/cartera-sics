import axios from "axios";

let token = "";
let tokenExpira = 0;

async function obtenerToken() {
  const response = await axios.post(
    "https://apoyo.sics.com.co/SICS360/api/InicioSesion/IniciarSesion",
    {
      Usuario: "ApoyoSICS",
      Clave: "#Apoyo2024",
      Key: "j3iANSX9T5zDePV4aWBB5eCiVaVXrhayzqBGtwKHWRrmR37jbb"
    }
  );

  token = response.data.Access;
  tokenExpira = Date.now() + 25 * 60 * 1000;
}

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

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
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.status(200).send(response.data);

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send(error.response?.data || error.message);
  }
}