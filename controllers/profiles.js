const uri = "mongodb+srv://admin:2480010@cluster0.i4bt4jt.mongodb.net/?retryWrites=true&w=majority";
const { MongoClient, ServerApiVersion } = require('mongodb');


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


const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

csigninstatus = true;
cemail = "mjxworks@gmail.com"
exports.patientid = async (req, res) => {
    const outp = await fetchByName(uri,'my_collection', 'MJ');
    res.render("patient", { 
      signinstatus: csigninstatus, 
      input: outp, email: cemail, 
      unique: cunique
    });
  }

exports.doctorid = async (req,res)=>{
    const outp = await fetchByName(uri, 'my_collection', 'MJ');
    res.render("doctor",{
      signinstatus: csigninstatus, 
      input :outp
    });  
  }

exports.chemistid = (req,res)=>{
    res.render("chemist",{signinstatus: csigninstatus});  
}