const Program = require("../models/Program");
const User = require("../models/User");

exports.createCourse = async (req, res) => {
  try {
    const program = await Program.create({
      name: req.body.name,
      description: req.body.description,
      user: req.session.userID,
    });
    req.flash("success", `${program.name} has been created successfully`);
    res.status(201).redirect("/programs");
  } catch (error) {
    req.flash("error", `Something happened!`);
    res.status(400).redirect("/programs");
  }
};

exports.getAllPrograms = async (req, res) => {
  try {
    const query = req.query.search;

    let filter = {};

    if (query) {
      filter = { name: query };
    }

    const programs = await Course.find({
      $or: [{ name: { $regex: ".*" + filter.name + ".*", $options: "i" } }],
    })
      .sort("-createdAt")
      .populate("user");

    res.status(200).render("programs", {
      programs,
      page_name: "programs",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    const course = await Course.findOne({ slug: req.params.slug }).populate(
      "user"
    );

    res.status(200).render("course", {
      course,
      page_name: "programs",
      user,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.programs.push({ _id: req.body.course_id });
    await user.save();

    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.releaseCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.programs.pull({ _id: req.body.course_id });
    await user.save();

    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndRemove({ slug: req.params.slug });

    req.flash("error", `${course.name} has been removed successfully`);

    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    course.name = req.body.name;
    course.description = req.body.description;

    course.save();

    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};
