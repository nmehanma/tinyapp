//libraries being used

const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();
app.use(cookieParser())
const PORT = 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.listen(PORT,()=> {
  console.log(`Example app listening  on port ${PORT}!`)
});

//helper functions

//Generates RandomString

function generateRandomString(length){
  let string ='';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  
  for (let i = 0; i <length; i++) {
    string += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return string
};

//Email Lookup
const emailLookup = function(email) {

  for(let user in users) {
    if(email === users[user].email)
    return true
  }

return false
};

//Password Lookup
const passwordLookup = function(password) {

  for(let user in users) {
    if(password === users[user].password)
    return true
  }
  return false
};

//iDlookup Lookup
const iDlookup = function(email) {
  for (let user in users) {

    if(email  === users[user].email) {
    return users[user].id
    }
  } 
  return false
};

//

//Databases
//global object database that contains => users

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email:"user2@example",
    password: "dishwasher-funk"
  }
};

//the database that contains the urls
const urlDatabase = {
  "b2xVn2": "http://lighthouselabs.com",
  "9sm5xK": "http://www.google.com"
};


// Dealing with app.get '/urls'
app.get('/urls', (req,res)=> {
  let user = users[req.cookies.user_ID]
  let templateVars = {
    urls: urlDatabase,
    user
   };
  res.render("urls_index", templateVars);
});

//Dealing with app.post '/urls

app.post('/urls',(req,res) => {
  let shortURL = generateRandomString(6)
  urlDatabase[shortURL] = req.body.longURL;
  console.log(shortURL);
  console.log(urlDatabase[shortURL]);
  
  res.redirect(`/urls/${shortURL}`)
});

app.get("/urls/new", (req, res) => {
  let user = users[req.cookies.user_ID];
  
  if(user) {
    let templateVars = {
      shortURL: req.params.shortURL, 
      longURL: urlDatabase[req.params.shortURL], 
      user, 
    }
    res.render("urls_new", templateVars);
  }
  
  res.redirect("/login")
});

//Dealing with app.get("/urls/:shortURL")
app.get("/urls/:shortURL", (req, res) => {
  let user = users[req.cookies.user_ID];
  
  if(user) {
    let templateVars = {
      shortURL: req.params.shortURL, 
      longURL: urlDatabase[req.params.shortURL], 
      user, 
      }
    res.render("urls_show", templateVars)
  }
  
  res.render("/login")
});

//Dealing with ("/register")

app.get("/register",(req,res)=> {
  let user = users[req.cookies.user_ID]
  let templateVars = {
  user
  };
    res.render("urls_register.ejs",templateVars);
  
});


app.post("/register",(req,res)=> {
  console.log(req.body)
  if(req.body.email === "" || req.body.password === "") {
    res.status(400).send("invalid")
  } else if (emailLookup(req.body.email)) {
    res.status(400).send("exists")
  
}
  else {
  let randomID = generateRandomString(6);
  users[randomID] = {id:randomID, email:req.body.email, password:req.body.password}

  console.log(req.body);
  
  res.cookie("user_ID", randomID);
  res.redirect("/urls");

  }
});



//Dealing with app.get("/login")

app.get("/login",(req,res)=> {
  let user = users[req.cookies.user_ID]
  let templateVars = {
    user
  }; 
  
  res.render("urls_login.ejs",templateVars)
});


app.post("/login",(req,res)=>{
  if( req.body.email === "" || req.body.password ==="") {
    res.status(403).send("strings should not be empty")
    return
  }
  if (!emailLookup(req.body.email)) {
    res.status(403).send("does not exist")
    return
  }else if (!passwordLookup(req.body.password)) {
    res.status(403).send("error")   
    return
  } else {
    console.log(req.body);
    res.cookie("username", iDlookup(req.body.email));
    
    res.redirect("/urls");
    return
  }
   
});


// logging out

app.post("/logout",(req,res)=> {
  res.clearCookie("user_ID",);
  res.redirect("/urls");
})




//updates url resource 
app.post("/urls/:shortURL/edit",(req, res)=> {
  urlDatabase[req.params.shortURL] = req.body.longURL;  
  res.redirect("/urls")
});
//Removes a URL resource from the URL database

app.post("/urls/:shortURL/delete",(req,res)=> {
  delete urlDatabase[req.params.shortURL]
   res.redirect("/urls");
});







// UNECESSARY

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







  



















