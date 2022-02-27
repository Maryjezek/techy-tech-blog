const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

// get all posts for homepage
router.get("/", (req, res) => {
  //res.json("hello");
  console.log("========GetAllPostsForHomepage==============");
  Post.findAll({
    include: [User, Comment],
  })
    .then((dbPostData) => {
      const posts = dbPostData.map((post) => post.get({ plain: true }));
      console.log(posts);
      res.render("homepage", {
        posts,
        loggedIn: req.session.loggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//create new post
router.get("/post/create", withAuth, (req, res) => {
  const post = { id: 0, title: "", content: "" };
  res.render("edit-post", {
    post,
    loggedIn: req.session.loggedIn,
  });
});

// get single post
router.get("/post/:id", (req, res) => {
  console.log("=========GetSinglePostToEditOrAddComment=============");
  console.log(req.params.id);
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "content", "title", "created_at"],
    include: [
      User,
      {
        model: Comment,
        attributes: ["comment_text"],
        include: [User],
      },
    ],
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }

      const post = dbPostData.get({ plain: true });
console.log(post);
      res.render("single-post", {
        post,
        loggedIn: req.session.loggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});
//MB

// edit single post
router.get("/post/edit/:id", withAuth, (req, res) => {
  console.log("=========RouteToGetASinglePostToEdit=============");
  console.log(req.params.id);
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "content", "title", "created_at"],
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" }); 
        return;
      }

      const post = dbPostData.get({ plain: true });

      res.render("edit-post", {
        post,
        loggedIn: req.session.loggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/post/edit/:id", withAuth, (req, res) => {
  console.log("=========RouteToSaveEditToASinglePost=============");
  Post.update(
    {
      title: req.body.title,
      content: req.body.content,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/post/create", withAuth, (req, res) => {
  Post.create({
    title: req.body.title,
    content: req.body.content,
    user_id: req.session.user_id,
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//mb

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("login");
});

module.exports = router;
