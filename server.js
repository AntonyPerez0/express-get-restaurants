const app = require("./src/app");
const db = require("./db/connection");
const port = 3001;

//TODO: Create your GET Request Route Below:
const Restaurant = require("./models/Restaurant");

app.listen(port, () => {
  db.sync();
  console.log(`Listening at http://localhost:${port}/restaurants`);
});
