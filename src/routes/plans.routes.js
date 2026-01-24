const express = require("express");
const { PLANS } = require("../core/users/plans");
const router = express.Router();

router.get("/", (_, res) => res.json(PLANS));

module.exports = router;
