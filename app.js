import createHttpError from 'http-errors';
import express from "express";
import logger from "morgan";
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import adminRoutes from "./routes/lessonRoute.js"
import quizRoute from "./routes/quizRoute.js"
import challangeRouter from "./routes/challangeRoute.js"
import submissionRoutes from "./routes/submissionRoutes.js"
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js"
import adminCheckSubmission from "./routes/adminCheckSubmission.js"
import quizResultRoute from "./routes/quizResultRoute.js"
import studentDashboard from "./routes/studentDashboardRoute.js"
import leaderboard from "./routes/leaderboardRoute.js"
import profile from "./routes/profileRoute.js";
import AdminDashboard  from './routes/adminDashboardRoute.js';

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

app.use('/auth',authRoute);
app.use('/user',userRoute);
app.use('/admin',adminRoutes);
app.use('/quiz',quizRoute);
app.use('/challange',challangeRouter);
app.use('/student',submissionRoutes);
app.use('/submissionCheck',adminCheckSubmission)
app.use("/quiz-result", quizResultRoute);
app.use("/dashboard",studentDashboard);
app.use("/leaderboard", leaderboard);
app.use("/profile",profile);
app.use("/adminDashboard",AdminDashboard)




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
