const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");

dotenv.config();

const DB = process.env.DATABASE_URL;

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
 }).then(con => {
     console.log('Db connection successful!');
 }).catch(err => console.log(err.message));

 const port = process.env.port || 8080;

app.listen(port, () => {
    console.log(`app running on port ${port}`)
})