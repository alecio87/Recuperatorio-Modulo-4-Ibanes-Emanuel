import { Request, Response } from "express";
import { User } from "../entity/User";
import { Profile } from "../entity/Profile";
import { Recipe } from "../entity/Recipe";

// -------- Agregar para jwt
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const jwtSecret = "somesecrettoken";
const jwtRefreshTokenSecret = "somesecrettokenrefresh";
let refreshTokens: (string | undefined)[] = [];

const createToken = (user: User) => {
  const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, {
    expiresIn: "300s",
  });
  const refreshToken = jwt.sign({ email: user.email }, jwtRefreshTokenSecret, {
    expiresIn: "90d",
  });

  refreshTokens.push(refreshToken);
  return {
    token,
    refreshToken,
  };
};

// --------

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({
      relations: {
        profile: true,
        recipe: true,
      },
    });
    const mappedUsers = users.map((user) => ({
      idUser: user.id,
      email: user.email,
      profile: user.profile
        ? {
            idProfile: user.profile.id,
            firstName: user.profile.firstName,
            lastName: user.profile.lastName,
          }
        : null,
      recipes: user.recipe.map((recipe) => ({
        idRecipe: recipe.id,
        name: recipe.name,
        description: recipe.description,
        ingredients: recipe.ingredients,
        preparation: recipe.preparation,
        estimatedPreparationTime: recipe.estimatedPreparationTime,
      })),
    }));
    return res.json(mappedUsers);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({
      where: { id: parseInt(id) },
      relations: ["profile", "recipe"],
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user) return res.status(404).json({ message: "User not found" });
    const mappedUser = {
      idUser: user.id,
      email: user.email,
      profile: user.profile
        ? {
            idProfile: user.profile.id,
            firstName: user.profile.firstName,
            lastName: user.profile.lastName,
          }
        : null,
      recipes: user.recipe.map((recipe) => ({
        idRecipe: recipe.id,
        name: recipe.name,
        description: recipe.description,
        ingredients: recipe.ingredients,
        preparation: recipe.preparation,
        estimatedPreparationTime: recipe.estimatedPreparationTime,
      })),
    };
    return res.json(mappedUser);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, profile } = req.body;

    const profileUser = new Profile();
    profileUser.firstName = profile.firstName;
    profileUser.lastName = profile.lastName;
    profileUser.dni = profile.dni;
    profileUser.gender = profile.gender;
    profileUser.address = profile.address;
    profileUser.city = profile.city;
    profileUser.country = profile.country;
    profileUser.cellPhone = profile.cellPhone;
    profileUser.photo = profile.photo;
    await profileUser.save();

    const user = new User();
    user.email = email;
    user.password = await createHash(password);
    user.profile = profileUser;
    await user.save();

    const mappedUser = {
      idUser: user.id,
      email: user.email,
      profile: {
        idProfile: user.profile.id,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        address: user.profile.address,
        cellPhone: user.profile.cellPhone,
        photo: user.profile.photo,
      },
    };

    return res.status(201).json(mappedUser);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({
      where: { id: parseInt(id) },
      relations: ["profile"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.email) {
      user.email = req.body.email;
    }

    if (req.body.password) {
      const newPassword = req.body.password;
      const hashedPassword = await createHash(newPassword);
      user.password = hashedPassword;
    }

    if (req.body.profile) {
      if (!user.profile) {
        user.profile = new Profile();
      }

      const profileData = req.body.profile;

      if (profileData.firstName) {
        user.profile.firstName = profileData.firstName;
      }

      if (profileData.lastName) {
        user.profile.lastName = profileData.lastName;
      }

      if (profileData.dni) {
        user.profile.dni = profileData.dni;
      }

      if (profileData.gender) {
        user.profile.gender = profileData.gender;
      }

      if (profileData.address) {
        user.profile.address = profileData.address;
      }

      if (profileData.city) {
        user.profile.city = profileData.city;
      }

      if (profileData.country) {
        user.profile.country = profileData.country;
      }

      if (profileData.cellPhone) {
        user.profile.cellPhone = profileData.cellPhone;
      }

      if (profileData.photo) {
        user.profile.photo = profileData.photo;
      }

      await user.profile.save();
    }

    await user.save();

     // Mapea los datos del usuario, incluso si no tiene un perfil
    const mappedUser = {
      idUser: user.id,
      email: user.email,
      profile: {
        idProfile: user.profile ? user.profile.id : null,
        firstName: user.profile ? user.profile.firstName : null,
        lastName: user.profile ? user.profile.lastName : null,
        dni: user.profile ? user.profile.dni : null,
        gender: user.profile ? user.profile.gender : null,
        address: user.profile ? user.profile.address : null,
        cellphone: user.profile ? user.profile.cellPhone : null,
      },
    };


    return res.status(201).json(mappedUser);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({
      where: { id: parseInt(id) },
      relations: ["profile", "recipe"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Elimina las recetas asociadas al usuario
    if (user.recipe && user.recipe.length > 0) {
      await Recipe.remove(user.recipe);
    }

    // Elimina el perfil del usuario
    if (user.profile) {
      await user.profile.remove();
    }

    // Elimina al usuario
    await user.remove();

    return res.sendStatus(204);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};


// ------- Agregar para jwt

//  Register
export const signUp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ msg: "Please. Send your email and password" });
  }

  const user = await User.findOneBy({ email: req.body.email });
  if (user) {
    return res.status(400).json({ msg: "The User already Exists" });
  }

  const newUser = new User();
  newUser.email = req.body.email;
  newUser.password = await createHash(req.body.password);
  await newUser.save();
  const mappedUser = {
    id: newUser.id,
    email: newUser.email,
  };
  return res.status(201).json(mappedUser);
};

//  Login
export const signIn = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ msg: "Please. Send your email and password" });
  }

  const user = await User.findOneBy({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ msg: "The User does not exists" });
  }

  const isMatch = await comparePassword(user, req.body.password);
  if (isMatch) {
    return res.status(201).json({ credentials: createToken(user) });
  }

  return res.status(400).json({
    msg: "The email or password are incorrect",
  });
};

export const protectedEndpoint = async (
  req: Request,
  res: Response
): Promise<Response> => {
  return res.status(200).json({ msg: "ok" });
};

const comparePassword = async (
  user: User,
  password: string
): Promise<Boolean> => {
  return await bcrypt.compare(password, user.password);
};

const createHash = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Create new access token from refresh token
export const refresh = async (req: Request, res: Response): Promise<any> => {
  const refreshToken = req.body.refresh;
  // If token is not provided, send error message
  if (!refreshToken) {
    res.status(401).json({
      errors: [{ msg: "Token not found" }],
    });
  }
  // If token does not exist, send error message
  if (!refreshTokens.includes(refreshToken)) {
    res.status(403).json({
      errors: [{ msg: "Invalid refresh token" }],
    });
  }
  try {
    const user = jwt.verify(refreshToken, jwtRefreshTokenSecret);
    // user = { email: 'jame@gmail.com', iat: 1633586290, exp: 1633586350 }
    const { email } = <any>user;
    const userFound = <User>await User.findOneBy({ email: email });
    if (!userFound) {
      return res.status(400).json({ msg: "The User does not exists" });
    }
    const accessToken = jwt.sign(
      { id: userFound.id, email: userFound.email },
      jwtSecret,
      { expiresIn: "120s" }
    );
    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({
      errors: [{ msg: "Invalid token" }],
    });
  }
};
