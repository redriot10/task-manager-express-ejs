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
app.get("/file/:filename", function (req, res) {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", function (err, filedata) {
    if (err) {
      return res.send("File not found");
    }

    res.render("show", {
      filename: req.params.filename,
      data: filedata
    });
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

app.get("/edit/:filename", function (req, res) {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", function (err, filedata) {
    if (err) {
      return res.send("File not found");
    }

    res.render("edit", {
      filename: req.params.filename,
      data: filedata
    });
  });
});
app.post("/edit/:filename", function (req, res) {
  const oldPath = `./files/${req.params.filename}`;
  const newFilename = req.body.newtitle.split(" ").join("") + ".txt";
  const newPath = `./files/${newFilename}`;

  fs.writeFile(newPath, req.body.newdata, function (err) {
    if (err) {
      return res.send("Error updating file");
    }

    // remove old file if renamed
    if (newPath !== oldPath) {
      fs.unlink(oldPath, () => {});
    }

    res.redirect("/");
  });
});





app.listen(3000, function () {
    console.log("running");
});
