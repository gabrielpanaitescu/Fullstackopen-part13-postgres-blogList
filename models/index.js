const Blog = require("./blog");
const User = require("./user");
const ReadingList = require("./readingList");
const Session = require("./session");

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: ReadingList, as: "marked_blogs" });
Blog.belongsToMany(User, { through: ReadingList, as: "marked_by" });

Blog.hasMany(ReadingList);
ReadingList.belongsTo(Blog);

User.hasMany(Session);
Session.belongsTo(User);

// const syncModels = async () => {
//   await User.sync({ alter: true });
//   await Blog.sync({ alter: true });
// };
// syncModels();

module.exports = {
  Blog,
  User,
  ReadingList,
  Session,
};
