const Program = require("../models/Program");
const User = require("../models/User");

exports.createProgram = async (req, res) => {
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

    const programs = await Program.find({
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

exports.getProgram = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    const program = await Program.findOne({ slug: req.params.slug }).populate(
      "user"
    );

    res.status(200).render("program", {
      program,
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

exports.enrollProgram = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.programs.push({ _id: req.body.program_id });
    await user.save();

    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.releaseProgram = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.programs.pull({ _id: req.body.program_id });
    await user.save();

    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.deleteProgram = async (req, res) => {
  try {
    const program = await Program.findOneAndRemove({ slug: req.params.slug });

    req.flash("error", `${program.name} has been removed successfully`);

    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.updateProgram = async (req, res) => {
  try {
    const program = await Program.findOne({ slug: req.params.slug });
    program.name = req.body.name;
    program.description = req.body.description;

    program.save();

    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};
