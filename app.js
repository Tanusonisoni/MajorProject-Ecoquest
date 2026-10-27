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
import notification from "./routes/notificationRoute.js"
import AdminDashboard  from './routes/adminDashboardRoute.js';
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

const app = express();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later."
  }
});

//security header
app.use(helmet());

app.use(cors({
  origin:process.env.CLIENT_URL,
  methods:["GET","POST","PUT","PATCH","DELETE"],
  allowedHeaders:["content-type","Authorization"]
}))

app.use(apiLimiter);

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
app.use('/lesson',adminRoutes);
app.use('/quiz',quizRoute);
app.use('/challange',challangeRouter);
app.use('/student',submissionRoutes);
app.use('/submissionCheck',adminCheckSubmission)
app.use("/quiz-result", quizResultRoute);
app.use("/dashboard",studentDashboard);
app.use("/leaderboard", leaderboard);
app.use("/profile",profile);
app.use("/adminDashboard",AdminDashboard)
app.use("/notification",notification)


app.use((err, req, res, next) => {
  console.error("ERROR MESSAGE:", err.message);
  console.error("ERROR DETAILS:", err);

  if (err.http_code) {
    console.error("CLOUDINARY HTTP CODE:", err.http_code);
  }

  res.status(err.status || err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});



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
