import { Router } from "express";
import {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from "../controllers/recipe.controller";
import passport from "passport";

const router = Router();

router.get("/recipe", passport.authenticate("jwt", { session: false }), getRecipes);
router.get("/recipe/:id", passport.authenticate("jwt", { session: false }), getRecipe);
router.post("/recipe/:id" ,passport.authenticate("jwt", { session: false }), createRecipe);
router.put("/recipe/:id" , passport.authenticate("jwt", { session: false }), updateRecipe);
router.delete("/recipe/:id", passport.authenticate("jwt", { session: false }), deleteRecipe);

export default router;