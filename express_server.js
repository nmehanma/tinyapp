//libraries being used

const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();
app.use(cookieParser())

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


// user wanting to login

// app.get("/login",(req, res)=> {

//   res.render("urls_new")
  
// })
//our server responds by getting the "urls_new" template to display to the client generating the HTML via res.render


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
// app.get("/urls/new", (req, res) => {
//   res.render("urls_new");
// });


app.get('/urls', (req,res)=> {
  // console.log(req.cookies)
  let user = users[req.cookies.user_ID]
  let templateVars = {

    urls: urlDatabase,
    user

   };
  res.render("urls_index", templateVars);
  });


app.get("/urls/:shortURL", (req, res) => {
  let user = users[req.cookies.user_ID]
  let templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], 
    user, 
    }
  res.render("urls_show",templateVars)
});

app.get("/register",(req,res)=> {
  let user = users[req.cookies.user_ID]
  let templateVars = {
  user
  };
    res.render("urls_register.ejs",templateVars);
  
});

app.get("/login",(req,res)=> {
  let user = users[req.cookies.user_ID]
  let templateVars = {
  user
  };
  
  res.render("urls_login.ejs",templateVars)
});


// adding to global object users similar to what we did with adding urlDatabase


// const users = {
//   "userRandomID": {
//     id: "userRandomID",
//     email: "user@example",
//     password: "purple-monkey-dinosaur"
//   },
//   "user2RandomID": {
//     id: "user2RandomID",
//     email:"user2@example",
//     password: "dishwasher-funk"
//   }
// };

const emailLookup = function(email) {

  for(let user in users) {
    if(email === users[user].email)
    return true
  }

return false
};

const passwordLookup = function(password) {

  for(let user in users) {
    if(password === users[user].password)
    return true
  }
  return false
};

const iDlookup = function(email) {
  for (let user in users) {
    if(email  === users[user].email) {
    return users[user].id
    }
  } 
  return false
}
  

 

  // for (let user in users) {
  //   if (users[user].email === req.body.email) {
  //     isUserExist = true;
  //   }

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

  

 

  // console.log(user);
  // users[randomID]= req.body.userRandom



  
  // console.log(username)

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

  


//updates url resource 
app.post("/urls/:shortURL/edit",(req, res)=> {
  urlDatabase[req.params.shortURL] = req.body.longURL;
   
  res.redirect("/urls")
})
//Removes a URL resource from the URL database

app.post("/urls/:shortURL/delete",(req,res)=> {
  delete urlDatabase[req.params.shortURL]

  res.redirect("/urls");

})

app.post("/login",(req,res)=>{

  if (!emailLookup(req.body.email)) {
    res.status(403).send("does not exist")

  }else if (!passwordLookup(req.body.password)) {
    res.status(403).send("error")

    
  } else {

    res.cookie("username", iDlookup(res.body.email));

  }
  
  res.redirect("/urls");

})

app.post("/logout",(req,res)=> {

  res.clearCookie("user_ID",);

  res.redirect("/urls");
})









//listening on port 80 and is logging a statement back to user to confirm  

app.listen(PORT,()=> {
  console.log(`Example app listening  on port ${PORT}!`)
});
