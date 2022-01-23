const express = require('express')
const bodyParser = require('body-parser');
const date = require(__dirname + "/date.js");



const {
    listen
} = require('express/lib/application');
const {
    Mongoose
} = require('mongoose');

const app = express();

//setup for EJS 
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'))

// // connect to mongo db
// mongoose.connect("mongodb://localhost:27017/todolistDB")

const newItems = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

// when app gets loaded (root route)...
app.get('/', function (req, res) {
    // function call from exported module to get todays date
    let theDate = date.dateGenerator();

    // list.ejs template is rendered, with two variables 
    res.render("list", {
        listTitle: theDate,
        newListItems: newItems
    });
});

app.get('/work', function (req, res) {
    // function call from exported module to get todays date

    // list.ejs template is rendered, with two variables 
    res.render("list", {
        listTitle: "WorkList",
        newListItems: workItems
    });
});

// POST request for new task addition, 
app.post("/", function (req, res) {

    console.log(req.body)

    // check where new item comes from and push/redirect accordingly
    if (req.body.listAddition == "WorkList") {
        workItems.push(req.body.newItem)
        res.redirect("/work");
    } else {
        
        newItems.push(req.body.newItem)
        res.redirect("/");}

})

// POST request for new task addition for work list, 
app.post("/work", function (req, res) {



    //input pushed to workItems array
    workItems.push(req.body.newItem)

    res.redirect("/work");

})

app.listen(3000, function () {
    console.log("Server started on port 3000..")
})