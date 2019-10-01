//libraries being used

const express = require('express');
const app = express();

const PORT = 8080; // default port 8080


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//helper function

function generateRandomString(length){
  
  let string ='';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  
  for (let i = 0; i <length; i++) {
    string += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return string

};

//set the view engine to ejs

app.set("view engine", "ejs");

//use res.render to load up an ejs view file

//our server responds by getting the "urls_new" template to display to the client generating the HTML via res.render

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

//the database that contains the urls
const urlDatabase = {
  "b2xVn2": "http://lighthouselabs.com",
  "9sm5xK": "http://www.google.com"

};

// user get requests and receives "Hello!" as reponse

app.get("/", (req, res)=> {
  res.send("Hello!");
});

// user get requests to urls.json
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// User get requests to /hello
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello<b>World</b></body></html")
});

//user being redirected to the longURL value of the shortURL from the database
//using req.params --> requiring params from urlDatabase for shortURL

app.get("/u/:shortURL",(req, res)=> {
  // console.log('meep!!!')
  const longURL = urlDatabase[req.params.shortURL];
  console.log('this one', longURL)
  res.redirect(longURL);

});

// taking a post from the user and is addding it to the urlDatabase attaching it to key shortURL
// redirecting to urls/shortURL

app.post("/urls",(req,res) => {
  let shortURL = generateRandomString(6)
  urlDatabase[shortURL] = req.body.longURL;
  console.log(shortURL);
  console.log(urlDatabase[shortURL]);
  
  res.redirect("/urls/" + shortURL)
});

//Removes a URL resource from the URL database

app.post("/urls/:shortURL/delete",(req,res)=> {
  delete urlDatabase[req.params.shortURL]

  res.redirect("/urls");

})



//listening on port 80 and is logging a statement back to user to confirm  

app.listen(PORT,()=> {
  console.log(`Example app listening  on port ${PORT}!`)
});
