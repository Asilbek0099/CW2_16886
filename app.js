const fs = require("fs");

const express = require("express");
const app = express();
const port = 3000;

const id = require("uniqid");

app.set("view engine", "pug");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  let created = req.query.create;

  let event = getAll("event");
  if (created) {
    res.render("list", { created: true, event: event });
  } else {
    res.render("list", { created: false, event: event });
  }
  res.render("list", {});
});

app.get("/create", (req, res) => {
  res.render("create", {});
});

app.post("/create", (req, res) => {
  let data = req.body;

  let events = {
    id: id(),
    Name: data.NameOfEvent,
    Location: data.Location,
    Description: data.Description,
    Purpose: data.Purpose,
    event_date: data.event_date,
  };

  let event = getAll("event");

  event.push(events);

  writeAll("event", event);

  res.redirect("/?created=true");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

function getAll(filename) {
  return JSON.parse(fs.readFileSync(`./App/${filename}.json`));
}

function writeAll(filename, data) {
  return fs.writeFileSync(`./App/${filename}.json`, JSON.stringify(data));
}
