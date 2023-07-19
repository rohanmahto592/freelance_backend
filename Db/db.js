const mongoose=require('mongoose')

async function connectDB()
{
    try{
        const connection = await mongoose.connect(process.env.MONGO_DB_CONNECTION_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('Connected to db');
    } catch(err) {
        console.log('Error occured : ', err.message);
    }
}
module.exports=connectDB
