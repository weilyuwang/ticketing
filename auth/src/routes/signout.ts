import express from "express";

const router = express.Router();

router.post("/api/users/signout", (req, res) => {
    // signout === clear session
    req.session = null;

    // send back an empty response
    res.send({});
});

export { router as signoutRouter };
