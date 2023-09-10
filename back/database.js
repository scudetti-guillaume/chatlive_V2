const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });
mongoose
    .connect(
        `${process.env.DB_USER_MONGO}://${process.env.DB_USER_PASS}@${process.env.DB_USER_CLUSTER}`,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch((err) => console.log("Connexion à MongoDB échouée ! : " + err));
