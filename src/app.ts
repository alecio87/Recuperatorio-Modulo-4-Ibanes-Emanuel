import express from "express";
import morgan from "morgan";
import cors from "cors";
import userRoutes from "./routes/user.router";
import recipeRoutes from "./routes/recipe.router";
import passportMiddleware from "./middlewares/passport";
import passport from "passport";
import passportLocal from "passport-local";

import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from 'swagger-jsdoc';
import {options} from './swaggerOptions'


const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));


//Agregar para jwt
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
passport.use(passportMiddleware);

const specs = swaggerJsDoc(options);
app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);


app.use("/api", userRoutes);
app.use("/api", recipeRoutes);

export default app;