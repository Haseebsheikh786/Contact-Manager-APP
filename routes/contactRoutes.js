const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();

const {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
} = require("../Controllers/ContactController");

router.use(validateToken);
// all the routes
router.route("/").get(getContacts);

router.route("/").post(createContact);

router.route("/:id").get(getContact);

router.route("/:id").put(updateContact);

router.route("/:id").delete(deleteContact);

module.exports = router;
