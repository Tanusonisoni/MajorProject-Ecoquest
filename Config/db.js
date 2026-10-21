import mangoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

export default async function connectDb() {
    try{
        const conn= await mangoose.connect(process.env.MONGODB_URI,
            {dbName:"eco-quest"}
            
        );

        if(conn){
            console.log("database connected");
        }

    }catch(error){
        console.log(error.message);
    }
}
console.log("MONGODB_URI",process.env.MONGODB_URI)