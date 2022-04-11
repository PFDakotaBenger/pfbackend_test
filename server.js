const express = require("express");
// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());  /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));   /* bodyParser.urlencoded() is deprecated */

const db = require("./models");
db.sequelize.sync();
// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to dakota benger's PowerFlex backend test application." });
});

// route that returns a factory and all the associated data
app.get("/factory/:id", (req, res) => {
    const id = parseInt(req.params.id);
    db.data.findAll({where: {
        factoryId: id
    }})   // find factory with id and include data
        .then(factory => {
            if (factory) {
                console.log(factory)
                res.json(factory);
            } else {
                res.status(404).json({ message: "Factory not found." });
            }   
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Error retrieving factory." });
        });
});

// return all factories and all associated data
app.get("/factorys", (req, res) => {
    db.data.findAll({ include: [{ all: true, nested: true }] }) 
        .then(data => {
            res.json(data);
        }
        )
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Error retrieving factorys." });
        }
        );

});

// return sprocket for a given id
app.get("/sprocket/:id", (req, res) => {
    const id = parseInt(req.params.id);
    db.sprocket.findAll({where: {
        id: id
     }})
        .then(sprocket => {
            if (sprocket) {
                res.json(sprocket);
            } else {
                res.status(404).json({ message: "Sprocket not found." });
            }
        })
        .catch(err => {
            res.status(500).json({ message: "Error retrieving sprocket." });
        });
});


// create new sprocket 
app.post("/sprocket", (req, res) => {
    db.sprocket.create(req.body)
        .then(sprocket => {
            res.status(201).json(sprocket);
        })
        .catch(err => {
            res.status(500).json({ message: "Error creating sprocket." });
        });
});

// update sprocket
app.put("/sprocket/:id", (req, res) => {
    const id = req.params.id;
    db.sprocket.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.json({
                    message: "Sprocket updated successfully."
                });
            } else {
                res.json({
                    message: `Cannot update sprocket with id=${id}. Maybe sprocket was not found or req.body is empty!`
                }); 
            }
        })
        .catch(err => {
            res.status(500).json({ message: "Error updating sprocket." });
        });
});





// set port, listen for requests
const PORT =  8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});