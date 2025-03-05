const User = require("../models/User");
const path = require("path");
const multer = require("multer");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// get users
exports.getUsers = async (req, res) => {
  try {
    const loggedInUserId = req.params.id; // Assuming req.user contains authenticated user info
    const users = await User.find({ _id: { $ne: loggedInUserId } }); // Exclude logged-in user

    const userProfiles = users.map((user) => ({
      _id: user._id,
      username: user.username,
      profilePicture: user.profilePicture,
    }));

    res.json(userProfiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET user by single id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // constructing the response object with profile picture URL
    const userProfile = {
      _id: user._id,
      username: user.username,
      profilePicture: user.profilePicture
        ? `/api/users/profile-picture/${user._id}`
        : null,
    };
    res.json(userProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET profile picture url
exports.getProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.profilePicture) {
      return res.status(404).json({ message: "Profile picture not found" });
    }
    // Send the profile picture
    res.sendFile(path.join(__dirname, "..", user.profilePicture));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// update by id
exports.updateById = (req, res) => {
  upload.single("profilePicture")(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const id = req.params.id;
      const updatedData = req.body;

      if (req.file) {
        updatedData.profilePicture = `/uploads/${req.file.filename}`;
      }

      const options = { new: true };

      const result = await User.findByIdAndUpdate(id, updatedData, options);

      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message });
    }
  });
};
// Delete user
exports.deleteUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await User.findByIdAndDelete(id);
    res.send(`Document with ${data.username} has been deleted`);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};
