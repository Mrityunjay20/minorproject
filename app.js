// jshint esversion:6

const express = require('express');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
var _ = require('lodash');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const { MongoClient, ServerApiVersion } = require('mongodb');
const { result } = require('lodash');

const initalpages = require('./controllers/initial');
const profiles = require('./controllers/profiles');
const uri = "mongodb+srv://admin:2480010@cluster0.i4bt4jt.mongodb.net/?retryWrites=true&w=majority";


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


let cpassword="";
let csigninstatus = false;
let cprofile = "";
let cemail = "";
let cname ="";
let cunique="";
let carray="";



async function authenticateUser(email, password) {
  try {
    await client.connect();
    const db = client.db('medicrypt');
    const usersCollection = db.collection('patients');
    const user = await usersCollection.findOne({ email });
    await client.close();
    if (!user) {
      console.error("User not found");
      return false;
    }
    if (user.password !== password) {
      console.error("Wrong password");
      return false;
    }
    console.log("Authentication successful");
    cemail = user.email;
    cunique = user.unique_code;
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

app.post("/logincheck", async (req, res) => {
  const inpt = {
    roles: req.body.loginAs,
    emails: req.body.emailz,
    passwords: req.body.passwordz
  };
  cprofile = inpt.roles;
  console.log(cprofile);
  const isauth = await authenticateUser(inpt.emails, inpt.passwords);
  if (isauth) {
    console.warn("login successful");
    csigninstatus=true;
    res.redirect('/checkprofile');
  }
   else {
    res.redirect("/");
  }
});


app.get("/checkprofile",(req,res)=>{
  if(cprofile === "Doctor"){
      res.redirect("/doctor_profile");
  }
  else if(cprofile === "Patient"){
      res.redirect('/patient_profile');
  }
  else if(cprofile === "Chemist"){
      res.redirect('/chemist_profile');
  }
  else{
      console.log("retry loggin in");
      res.redirect('/');
  }
});


async function fetchByName(databaseUrl,collectionName, name) {
  const client = new MongoClient(databaseUrl);
  await client.connect();
  const db = client.db('patients');
  const collection = db.collection(collectionName);

  const result = await collection.findOne(
    { name },
    { projection: { my_array_field: 1 } }
  );
  await client.close();
  return result ? result.my_array_field : null;
}

// Use the fetchByName function in the route handler
app.get("/patient_profile",async (req, res) => {
  const outp = await fetchByName(uri,'my_collection', 'MJ');
  res.render("patient", { 
    signinstatus: csigninstatus, 
    input: outp, email: cemail, 
    unique: cunique
  });
});




app.get("/doctor_create",(req,res)=>{
  res.render("doctor_create",{
    signinstatus: csigninstatus
  })
});

app.post("/addmedi", async (req,res)=>{
  const inpt = {
    email: req.body.emailz,
    unique_code: req.body.uniquez,
    medicine: req.body.medicinez
  }
  
  try {
    await client.connect();

    const db = client.db('patients');
    const collection = db.collection('my_collection');

    await collection.updateOne(
      { email: inpt.email },
      { $push: { myArray: inpt.medicine } }
    );

  } finally {
    await client.close();
  }
  res.redirect("/doctor_profile");
});




//final done
app.get("/",initalpages.renderhome);
app.get("/login",initalpages.renderlogin);
app.get("/reset_password",initalpages.resetpass);




app.get("/patient_profile", profiles.patientid);
app.get("/doctor_profile",profiles.doctorid);
app.get("/chemist_profile",profiles.chemistid);







app.get("/signout",);



app.listen(3000, function() {
    console.log("Server started on port 3000");
});
  

