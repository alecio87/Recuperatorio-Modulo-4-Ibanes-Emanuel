import { Request, Response } from "express";
import { Recipe } from "../entity/Recipe";
import { User } from "../entity/User";

export const getRecipes = async (req: Request, res: Response) => {
  try {
    const recipes = await Recipe.find({
      relations: {
        user: true,
      },
    });

    return res.json(recipes);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const getRecipe = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findOne({
      where: { id: parseInt(id) },
      relations: ["user"],
    });
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    return res.json(recipe);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const createRecipe = async (req: Request, res: Response) => {
  const { recipe } = req.body;

  try {
    const { id } = req.params;
    const user = await User.findOne({
      where: { id: parseInt(id) },
      relations: ["recipe"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newRecipe = new Recipe();
    newRecipe.name = recipe.name;
    newRecipe.description = recipe.description;
    newRecipe.image = recipe.image;
    newRecipe.ingredients = recipe.ingredients;
    newRecipe.preparation = recipe.preparation;
    newRecipe.estimatedPreparationTime = recipe.estimatedPreparationTime;

    newRecipe.user = user;

    await newRecipe.save();

    return res.json(newRecipe);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const updateRecipe = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const recipe = await Recipe.findOneBy({ id: parseInt(id) });

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    const recipeData = req.body;

    if (recipeData.name) {
      recipe.name = recipeData.name;
    }

    if (recipeData.description) {
      recipe.description = recipeData.description;
    }

    if (recipeData.image) {
      recipe.image = recipeData.image;
    }

    if (recipeData.ingredients) {
      recipe.ingredients = recipeData.ingredients;
    }

    if (recipeData.preparation) {
      recipe.preparation = recipeData.preparation;
    }

    if (recipeData.estimatedPreparationTime) {
      recipe.estimatedPreparationTime = recipeData.estimatedPreparationTime;
    }

    await recipe.save();

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: "Error during the update" });
  }
};

export const deleteRecipe = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findOne({
      where: { id: parseInt(id) },
    });

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    await Recipe.remove(recipe);

    return res.sendStatus(204);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};