exports.allAccess = (req, res) => {
  res.status(200).json({
    message: "Welcome to the Public Section!",
    access: "Everyone can view this content.",
    timestamp: new Date().toISOString()
  });
};

exports.userBoard = (req, res) => {
  res.status(200).json({
    message: "Welcome to the User Dashboard!",
    user: req.user ? req.user.username : "Guest",
    access: "Registered users only",
    timestamp: new Date().toISOString()
  });
};

exports.adminBoard = (req, res) => {
  res.status(200).json({
    message: "Welcome to the Admin Panel!",
    user: req.user ? req.user.username : "Unknown",
    access: "Admins only",
    actions: ["Manage users", "View reports", "System settings"],
    timestamp: new Date().toISOString()
  });
};

exports.moderatorBoard = (req, res) => {
  res.status(200).json({
    message: "Welcome to the Moderator Dashboard!",
    user: req.user ? req.user.username : "Unknown",
    access: "Moderators only",
    actions: ["Review posts", "Manage comments", "Suspend users"],
    timestamp: new Date().toISOString()
  });
};
