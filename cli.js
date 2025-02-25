const { QueryTypes } = require("sequelize");
const { sequelize } = require("./index");

const getBlogs = async () => {
  const blogs = await sequelize.query("SELECT * FROM blogs", {
    type: QueryTypes.SELECT,
  });

  blogs.forEach((blog) => {
    console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`);
  });
};

getBlogs();
