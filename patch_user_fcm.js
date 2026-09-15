const fs = require('fs');
let file = 'server/controllers/userController.js';
let content = fs.readFileSync(file, 'utf8');

const newMethod = `
const updateFcmToken = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (user) {
    user.fcmToken = req.body.fcmToken;
    await user.save();
    res.json({ message: 'FCM token updated successfully' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};
`;

content = content.replace('module.exports = {', newMethod + '\nmodule.exports = { updateFcmToken,');

fs.writeFileSync(file, content);

let routeFile = 'server/routes/userRoutes.js';
let routeContent = fs.readFileSync(routeFile, 'utf8');

routeContent = routeContent.replace(
  'const { authUser, registerUser, getUsers, getUserProfile, updateUserProfile, createUser, deleteUser, updateUserRole } = require(\'../controllers/userController\');',
  'const { authUser, registerUser, getUsers, getUserProfile, updateUserProfile, createUser, deleteUser, updateUserRole, updateFcmToken } = require(\'../controllers/userController\');'
);

routeContent = routeContent.replace(
  'router.route(\'/profile\').get(protect, getUserProfile).put(protect, updateUserProfile);',
  'router.route(\'/profile\').get(protect, getUserProfile).put(protect, updateUserProfile);\nrouter.route(\'/fcm-token\').put(protect, updateFcmToken);'
);

fs.writeFileSync(routeFile, routeContent);
console.log('User controller and routes updated');
