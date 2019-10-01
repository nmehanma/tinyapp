const express = require('express');
const app = express();

const PORT = 8080; // default port 8080


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

function generateRandomString(length){
  
  let string ='';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  
  for (let i = 0; i <length; i++) {
    string += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return string

};




// urlDatabase[generateRandomString(6)] 



//set the view engine to ejs



app.set("view engine", "ejs");

//use res.render to load up an ejs view file

//our server responds by getting the "urls_new" template to display to the client generating the HTML

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get('/urls', (req,res)=> {
  let templateVars = {urls: urlDatabase };
  res.render("urls_index", templateVars);
})

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]}
  res.render("urls_show",templateVars)
});


const urlDatabase = {
  "b2xVn2": "http://lighthouselabs.com",
  "9sm5xK": "http://www.google.com"

};


app.get("/", (req, res)=> {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello<b>World</b></body></html")
});

app.post("/urls",(req,res) => {
  let shortURL = generateRandomString(6)
  urlDatabase[shortURL] = req.body.longURL;
  console.log(shortURL);
  console.log(urlDatabase[shortURL]);
  
  res.redirect("/urls/" + shortURL)
});



  

app.listen(PORT,()=> {
  console.log(`Example app listening  on port ${PORT}!`)
});
