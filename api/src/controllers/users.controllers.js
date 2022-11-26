const { response, request } = require("express");
const { User, UserProfile, Op } = require("../db");

// User

const getUsers = async (req = request, res = response) => {
  try {
    let usersFromDb = await User.findAll();

    if (!usersFromDb.length) {
      return res.status(404).send("No users found");
    }

    usersFromDb = usersFromDb.map((user) => user.dataValues);
    res.status(200).send(usersFromDb);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const createUser = async (req = request, res = response) => {
  const { email } = req.query;

  if (!email.length) {
    return res.status(400).send("No email provided");
  }
  try {
    const userExists = await User.findOne({ where: { email: email } });

    if (userExists !== null) {
      return res.status(200).send(userExists.dataValues);
    }
    const newUser = await User.create({
      email,
    });
    res.status(201).send(newUser.dataValues);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const deleteUser = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    await User.destroy({
      where: {
        id,
      },
    });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// User Profile

const createUserProfile = async (req = request, res = response) => {
  const { name, email, adress, country, city, zipCode, phone } = req.body;
  console.log("🚀 ~ file: users.controllers.js ~ line 60 ~ createUserProfile ~ req", req)

  try {
    const userExists = await UserProfile.findOne({
       where: {email : email}
    })

    if (userExists !== null) {
      return res.status(200).send(userExists);
    } else {
      const newUser = await UserProfile.create({
        name,
        email,
        phone,
        adress,
        country,
        city,
        zipCode,
      });
      return res.status(201).send(newUser)
      console.log(newUser,"me devuelve el post")
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

const deleteUserProfile = async (req = request, res = response) => {
  const { email } = req.query;
  try {
    await UserProfile.destroy({
      where: {
        email,
      },
    });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getAllUserProfiles = async (req = request, res = response) => {
  try {
    let usersFromDb = await UserProfile.findAll();
    if (!usersFromDb.length) {
      return res.status(404).send("No user profiles found");
    }
    usersFromDb = usersFromDb.map((user) => user.dataValues);
    res.status(200).send(usersFromDb);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getUserProfileByEmail = async (req = request, res = response) => {
  
  const { email } = req.query;
  try {
    let usersFromDb = await UserProfile.findOne({ where: { email: email } });
    if (!usersFromDb) {
      return res.status(404).send("No users found");
    }
    res.status(200).send(usersFromDb.dataValues);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

const updateUserProfile = async (req = request, res = response) => {
  let {email} = req.params;
  let  {name, country, city, zipCode, phone, adress}  = req.body;
  console.log("🚀 ~ file: users.controllers.js ~ line 141 ~ updateProfile ~ req", req.body)
  const targetUserProfile = await UserProfile.findByPk(email);
  console.log("target review", targetUserProfile)
  try {
    const updateReview = await targetUserProfile.update({
      name: name,
      country: country,
      city: city,
      zipCode: zipCode,
      phone: phone,
      adress: adress
    });
    console.log("esto es el coso", updateReview)
    await updateReview.save();
    res.status(200).send('Se actualizo la informacion con exito')
  } catch (error) {
    res.status(404).send('No se pudo actualizar la informacion')
  }
};

// const updateUserProfile = async (req = request, res = response) => {
//   let {email} = req.params;
//   let  {name, country, city, zipCode, phone, adress}  = req.body;
//   console.log("🚀 ~ file: users.controllers.js ~ line 141 ~ updateProfile ~ req", req.body)
//   const targetReview = await UserProfile.findByPk(email);
//   console.log("target review", targetReview)
//   try {
//     const updateReview = await targetReview.update({
//       name: name,
//       country: country,
//       city: city,
//       zipCode: zipCode,
//       phone: phone,
//       adress: adress
//     });
//     console.log("esto es el coso", updateReview)
//     await updateReview.save();
//     res.status(200).send('Se actualizo la informacion con exito')
//   } catch (error) {
//     res.status(404).send('No se pudo actualizar la informacion')
//   }
// };

module.exports = {
  getUsers,
  createUser,
  deleteUser,
  createUserProfile,
  deleteUserProfile,
  getAllUserProfiles,
  getUserProfileByEmail,
  updateUserProfile,
};
