const Contact = require("../models/contactModels");
const asyncHandler = require("express-async-handler");

const getContacts = asyncHandler(async (req, res) => {
  const user_id = req.user._id;
  try {
    const contact = await Contact.find({ user_id }).sort({ createdAt: -1 });
    res.status(200).json(contact);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  const user_id = req.user._id;
  try {
    const contact = await Contact.create({ name, email, phone, user_id });
    res.status(200).json(contact);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const getContact = asyncHandler(async (req, res) => {
  const contacts = await Contact.findById(req.params.id);
  if (!contacts) {
    res.status(404);
    throw new Error("cantact not found");
  }
  res.status(200).json(contacts);
});

const updateContact = asyncHandler(async (req, res) => {
  const contacts = await Contact.findById(req.params.id);
  if (!contacts) {
    res.status(404);
    throw new Error("cantact not found");
  }

  if (contacts.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("user don't have permission to update other user contact");
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedContact);
});

const deleteContact = asyncHandler(async (req, res) => {
  const contacts = await Contact.findById(req.params.id);
  if (!contacts) {
    res.status(404);
    throw new Error("cantact not found");
  }

  if (contacts.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("user don't have permission to delete other user contact");
  }

  await Contact.deleteOne({ _id: req.params.id });
  res.status(200).json(contacts);
});

module.exports = {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};
