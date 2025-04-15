const clothingItem = require("../models/clothingItems");
const {
  NOT_FOUND,
  FORBIDDEN,
  handleValidationError,
} = require("../utils/errors");

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

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  clothingItem
    .findById(itemId)
    .orFail(() => {
      const err = new Error("Item not found");
      err.statusCode = NOT_FOUND;
      throw err;
    })
    .then((item) => {
      if (item.owner.toString() !== userId) {
        const err = new Error("Forbidden");
        err.statusCode = FORBIDDEN;
        throw err;
      }
      return clothingItem.findByIdAndDelete(itemId);
    })
    .then((deletedItem) => res.status(200).json(deletedItem))
    .catch((err) => handleValidationError(err, req, res));
};

const likeItem = (req, res) => {
  const itemId = req.params;
  clothingItem
    .findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
      { new: true }
    )
    .orFail(() => {
      const err = new Error("Item not found");
      err.statusCode = NOT_FOUND;
      throw err;
    })
    .then((item) => res.status(200).json(item))
    .catch((err) => handleValidationError(err, req, res));
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  clothingItem
    .findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } }, // remove _id from the array
      { new: true }
    )
    .orFail(() => {
      const err = new Error("Item not found");
      err.statusCode = NOT_FOUND;
      throw err;
    })
    .then((item) => res.status(200).send(item))
    .catch((err) => handleValidationError(err, req, res));
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
