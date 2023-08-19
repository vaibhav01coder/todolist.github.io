//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todoListDB",{useNewUrlParser: true})


const itemsSchema = {

  name:String

};

const Item = mongoose.model("It",itemsSchema);

const item1 = new Item({
  name:'welcome to your todo list'
});

const item2 = new Item({
  name:'nice to be here'
});

const item3 = new Item({
  name:'nice to be here'
});

const defaultItems= [item1,item2,item3];

const listSchema={
  name:String,
  items:[itemsSchema]
};

const List = mongoose.model("List",listSchema);

app.get("/", function(req, res) {

Item.find({},function(err,foundItems){

  if(foundItems.length === 0){
    Item.insertMany(defaultItems,function(err){

      if(err)
      console.log(err)
      else
      console.log("successfull")
    });
  
  

  res.redirect("/");
}
else {

  res.render("list", {listTitle: 'Today', newListItems: foundItems});

}

});

});

// app.get("/:customListName",function(req,res){
// const customListName= req.params.customListName;

// const list=new List({
//   name:customListName,
//   items:defaultItems
// })

// list.save();

// })

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    name:itemName
  })

  item.save()

  res.redirect("/")
});


app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  
    Item.findByIdAndRemove(checkedItemId, function(err){
      if (!err) {
        console.log("Successfully deleted checked item.");
        res.redirect("/");
      }
    });
  


});




app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
