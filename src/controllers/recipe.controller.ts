import { Request, Response } from "express";
import { Recipe } from "../entity/Recipe";
import { User } from "../entity/User";

export const getRecipes = async (req: Request, res: Response) => {
  try {
    const recipes = await Recipe.find({
      relations: ["user", "user.profile"],
    });

    const mappedRecipes = recipes.map((recipe) => ({
      idRecipe: recipe.id,
      name: recipe.name,
      description: recipe.description,
      ingredients: recipe.ingredients,
      preparation: recipe.preparation,
      estimatedPreparationTime: recipe.estimatedPreparationTime,
      user: {
        idUser: recipe.user?.id || null,
        email: recipe.user?.email || null,
        profile: {
          idProfile: recipe.user?.profile?.id || null,
          firstName: recipe.user?.profile?.firstName || null,
          lastName: recipe.user?.profile?.lastName || null,
          address: recipe.user?.profile?.address || null,
          cellPhone: recipe.user?.profile?.cellPhone || null,
        },
      },
    }));

    return res.json(mappedRecipes);
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
    const mappedRecipe = {
      idRecipe: recipe.id,
      name: recipe.name,
      description: recipe.description,
      ingredients: recipe.ingredients,
      preparation: recipe.preparation,
      estimatedPreparationTime: recipe.estimatedPreparationTime,
      user: {
        idUser: recipe.user.id,
        email: recipe.user.email,
        profile: {
          idProfile: recipe.user.profile.id,
          firstName: recipe.user.profile.firstName,
          lastName: recipe.user.profile.lastName,
          address: recipe.user.profile.address,
          cellPhone: recipe.user.profile.cellPhone,
        },
      },
    };
    return res.json(mappedRecipe);
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
      relations: ["recipe", "profile"],
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
    const mappedRecipe = {
      idRecipe: newRecipe.id,
      name: newRecipe.name,
      description: newRecipe.description,
      ingredients: newRecipe.ingredients,
      preparation: newRecipe.preparation,
      estimatedPreparationTime: newRecipe.estimatedPreparationTime,
      user: {
        idUser: user.id,
        email: user.email,
        profile: user.profile
          ? {
              idProfile: user.profile.id,
              firstName: user.profile.firstName,
              lastName: user.profile.lastName,
              address: user.profile.address,
              cellPhone: user.profile.cellPhone,
            }
          : null,
      },
    };

    return res.status(201).json(mappedRecipe);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const updateRecipe = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const recipe = await Recipe.findOne({
      where: { id: parseInt(id) },
      relations: ["user", "user.profile"],
    });

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

    // Mapear los datos del usuario y el perfil
    const mappedRecipe = {
      idRecipe: recipe.id,
      name: recipe.name,
      description: recipe.description,
      ingredients: recipe.ingredients,
      preparation: recipe.preparation,
      estimatedPreparationTime: recipe.estimatedPreparationTime,
      user: {
        idUser: recipe.user.id,
        email: recipe.user.email,
        profile: {
          idProfile: recipe.user.profile.id,
          firstName: recipe.user.profile.firstName,
          lastName: recipe.user.profile.lastName,
          address: recipe.user.profile.address,
          cellPhone: recipe.user.profile.cellPhone,
        },
      },
    };

    return res.status(200).json(mappedRecipe);
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
