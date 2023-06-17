const express = require("express");
const cors = require("cors");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
require("dotenv").config();
const PORT = process.env.PORT;

const app = express();
app.use(express.json());

// Configuration du middleware cors avec les options appropriées
app.use(cors());

/* MAILGUN CONFIGURATION */
const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: "John Doe",
  key: process.env.APIKEY /* VOTRE CLÉ API */,
});

app.get("/", (req, res) => {
  res.json({ message: "Server is up and running!" }); // Réponse JSON avec un message
});

app.post("/form", async (req, res) => {
  try {
    //   Le console.log de req.body nous affiche les données qui ont été rentrées dans les inputs (dans le formulaire frontend) :
    console.log(req.body);

    // On destructure req.body
    const { firstname, lastname, email, message } = req.body;

    //   On crée un objet messageData qui contient des informations concernant le mail (qui m'envoie le mail, adresse vers laquelle je veux envoyer le mail, titre et contenu du mail) :
    const messageData = {
      from: `${firstname} ${lastname} <${email}>`,
      to: process.env.RECEIPT,
      subject: `Formulaire JS`,
      text: message,
    };

    // On envoie les infos à Mailgun pour créer le mail et l'envoyer
    const response = await client.messages.create(
      process.env.SANDBOX, // <==== ⚠️ le domain commence par "sandbox" et fini par ".mailgun.org"
      messageData
    );

    console.log(response);

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log("Server is up and running!"); // Message affiché lorsque le serveur est démarré
});
