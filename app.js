const express = require("express");
const app = express();

const PORT = 3000;

// Middleware
app.use(express.json()); // Parse JSON bodies

app.use("/", require("./routes/index.js"));

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
})