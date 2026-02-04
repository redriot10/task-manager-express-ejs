const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
    fs.readdir('./files', function (err, files) {
        if (err) {
            console.log(err);
            return res.send("Error reading files");
        }
        res.render("index", { files: files });

    });
});
app.post("/create", function (req, res) {
  const filename = req.body.title.split(" ").join("");

  fs.writeFile(`./files/${filename}.txt`, req.body.details, function (err) {
    if (err) {
      console.log(err);
      return res.send("Error creating file");
    }
    res.redirect("/");
  });
});


app.listen(3000, function () {
    console.log("running");
});
