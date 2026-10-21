import createHttpError from 'http-errors';
import express from "express";
import logger from "morgan";
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import  adminRoutes from "./routes/lessonRoute.js"
import quizRoute from "./routes/quizRoute.js"

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));


app.get("/",(req,res)=>{
  res.json({
    success:true,
    message:"eco quest api test"
  })
})

app.use('/admin',adminRoutes);
app.use('/quiz',quizRoute);




// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

export default app;
