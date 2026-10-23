import multer from "multer"

const storage=multer.memoryStorage();
 
const upload=multer({
    storage,
    limits:{
        fileSize:100 * 1024 * 1024
    },
    fileFilter:(req,file,cb)=>{
        const allowTypes=[
            "image/jpeg",
            "image/png",
             "image/webp",
             "video/mp4",
             "video/webm"
        ];
        if(allowTypes.includes(file.mimetype)){
            cb(null,true);
        }else{
            cb(new Error("only JPEG ,PNG , WEBP images and MP4, WEBM video are allowed"));
        }
    }
});
export default upload;