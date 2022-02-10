const express = require('express')
const bodyParser = require('body-parser');
// const date = require(__dirname + "/date.js");
const mongoose = require('mongoose', {
    useNewUrlParser: true
});



const {
    listen
} = require('express/lib/application');
const e = require('express');


const app = express();

//setup for EJS 
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'))

// connect to local mongo db
mongoose.connect("mongodb://localhost:27017/todolistDB")

//create a new db schema , with a field for the name of task
const itemsSchema = {
    name: String
};

//create a new model based on above schema
const Item = mongoose.model('Item', itemsSchema)

//placeholder documents as default items in db
const item1 = new Item({
    name: "Welcome to Remember The Eggs!"
})
const item2 = new Item({
    name: "Click on + to add a new item"
})
const item3 = new Item({
    name: "<--- CLick here to cross an item off"
})

//new array containing placeholders created above
const defaultItems = [item1, item2, item3]

// create name and array of item documents for newList
const listSchema = {
    name: String,
    items: [itemsSchema]

};
// create list model from listSchema
const List = mongoose.model("List", listSchema);






const newItems = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

// when app gets loaded (root route)...
app.get('/', function (req, res) {

    // use find method to display all documents in collection
    Item.find({}, function (err, returnedItems) {

        if (returnedItems.length === 0) {
            //use insertMany method to populate DB with default items array if len of our db === 0
            Item.insertMany(defaultItems, function (err) {
                //print response or errors (if applicable) to console
                if (err) {
                    console.log(err)
                } else {
                    console.log("Default array succesfully initiated")
                }
            });
            //redirect back to home route to display items
            res.redirect("/")
            // else render list.ejs 
        } else {
            res.render("list", {
                listTitle: "Today",
                // pass found items to our list EJS template
                newListItems: returnedItems
            });
        };
        returnedItems.forEach(function (value) {
            console.log(value.name)


        });


    });

});

// GET for custom list name
app.get('/:listName', function(req,res){
    const customListName = req.params.listName
    // check to see if list already exists in  database
    List.findOne({name: customListName}, function(err,foundList){
        if(!err){
            if (!foundList){
                //create new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                   //save to lists collection
                list.save();

                res.redirect("/"+customListName)
            }else {
                //Show existing list
                res.render("list", {
                    listTitle: foundList.name,
                    // pass found items to our list EJS template
                    newListItems: foundList.items
                })
            }
        }
    })

   

 
    
    
})

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

    const itemName = new Item({
        //refers to text entered in input field of form 
        name: req.body.newItem
    });

    // save item to collection
    itemName.save();
    // redirect back to home route to display items (with new item added)
    res.redirect("/");

})

// POST request for new task addition for work list, 
app.post("/work", function (req, res) {



    //input pushed to workItems array
    workItems.push(req.body.newItem)

    res.redirect("/work");

})
// POST request for task deletion 
app.post("/delete", function (req, res) {

    const checkedItemId = req.body.checkbox
    // callback needs to be initiated for Remove execution to happen as per mongoose guidelines
    Item.findByIdAndRemove(checkedItemId, function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log("Item with ID: " + checkedItemId + " was succesfully deleted")
            res.redirect("/")
        }
    })
});

// es6 syntax for function call (will update others)
app.listen(3000,  () => console.log("Server started on port 3000.."))