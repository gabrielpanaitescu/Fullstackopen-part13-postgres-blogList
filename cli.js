const { QueryTypes } = require("sequelize");
const { sequelize } = require("./util/db");

const getBlogs = async () => {
  try {
    await sequelize.authenticate();

    const blogs = await sequelize.query("SELECT * FROM blogs", {
      type: QueryTypes.SELECT,
    });

    blogs.forEach((blog) => {
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`);
    });

    sequelize.close();
  } catch (error) {
    console.log("Unable to connect to the database: ", error);
  }
};

getBlogs();
