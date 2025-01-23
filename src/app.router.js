import connectDB from "../DB/connection.js";
import { glopalErrHandling } from "./utils/errorHandling.js";
import userRouter from './modules/user/user.router.js'
import authRouter from './modules/auth/auth.router.js'
import clientRouter from './modules/cient/client.router.js'
const initApp = (app, express) => {
  app.use(express.json({}));

  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/client", clientRouter);


  app.all("*", (req, res, next) => {
    return next(new Error("error 404 in-valid routing",{cause:404}))
  });

  app.use(glopalErrHandling);

  //connect DataBase
  connectDB();
};

export default initApp;
