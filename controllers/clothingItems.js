const clothingItem = require("../models/clothingItems");
const handleValidationError = require("../utils/errors");

const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.status(200).json(items))
    .catch((err) => handleValidationError(err, req, res));
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  clothingItem
    .create({
      name,
      weather,
      imageUrl,
      owner: req.user._id,
      likes: [],
      createdAt: Date.now(),
    })
    .then((item) => res.status(201).json(item))
    .catch((err) => handleValidationError(err, req, res));
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;
  clothingItem
    .findByIdAndUpdate(itemId, { $set: { imageURL } })
    .orFail(() => {
      const err = new Error("Item not found");
      err.statusCode = 404;
      throw err;
    })
    .then((item) => res.status(200).send(item))
    .catch((err) => handleValidationError(err, req, res));
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  clothingItem
    .findByIdAndDelete(itemId)
    .orFail(() => {
      const err = new Error("Item not found");
      err.statusCode = 404;
      throw err;
    })
    .then((item) => res.status(200).send(item))
    .catch((err) => handleValidationError(err, req, res));
};

const likeItem = (req, res) => {
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
      { new: true }
    )
    .orFail(() => {
      const err = new Error("Item not found");
      err.statusCode = 404;
      throw err;
    })
    .then((item) => res.status(200).json(item))
    .catch((err) => handleValidationError(err, req, res));
};

const dislikeItem = (req, res) => {
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } }, // remove _id from the array
      { new: true }
    )
    .orFail(() => {
      const err = new Error("Item not found");
      err.statusCode = 404;
      throw err;
    })
    .then((item) => res.status(200).send(item))
    .catch((err) => handleValidationError(err, req, res));
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  updateItem,
  likeItem,
  dislikeItem,
};
