import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export function genrateToken(data){
    try{
        let token=jwt.sign(data,process.env.TOKEN_SECREAT,{expiresIn:"1d"});
         return token;
    }catch (error) {
        console.error("Token generation error:", error.message);
        throw error;
    }
}

export function verifytoken(token){
    try{
        let tokenData=jwt.verify(token,process.env.TOKEN_SECREAT);
        return tokenData;
    }
    catch(error){
        console.log(error);
        return false;
    }
}