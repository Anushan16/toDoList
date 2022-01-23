const express = require('express')
const bodyParser = require('body-parser');
const date = require(__dirname+ "/date.js");


const { listen } = require('express/lib/application');

const app = express();

//setup for EJS 
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'))

const newItems = ["Buy Food", "Cook Food", "Eat Food"
];

// when app gets loaded (root route)...
app.get('/', function(req,res) {
    // function call from exported module to get todays date
    let theDate = date.dateGenerator();
    
    // list.ejs template is rendered, with two variables 
    res.render("list", {kindOfDay: theDate, newListItems: newItems});
});

// POST request for new task addition, 
app.post("/", function(req,res) {

//input in newItem pushed to newItems array
     newItems.push(req.body.newItem)

    res.redirect("/"); 

})

app.listen(3000,function(){
    console.log("Server started on port 3000..")
})
