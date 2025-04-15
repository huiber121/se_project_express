const clothingItem = require("../models/clothingItems");
const {
  NOT_FOUND,
  FORBIDDEN,
  BAD_REQUEST,
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
  const { id } = req.params;
  const userId = req.user._id;

  if (!id) {
    return res.status(BAD_REQUEST).send({ message: "Item ID is required" });
  }

  return clothingItem
    .findById(id)
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }

      // Check if the item belongs to the user
      if (item.owner.toString() !== userId) {
        return res
          .status(FORBIDDEN)
          .send({ message: "You are not authorized to delete this item" });
      }

      // If the user is the owner, delete the item
      return clothingItem.findByIdAndDelete(id).then((deletedItem) =>
        res.status(200).send(deletedItem)
      );
    })
    .catch((err) => handleValidationError(err, req, res));
};


const likeItem = (req, res) => {
  const { id } = req.params;
  clothingItem
    .findByIdAndUpdate(
      id,
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
  const { id } = req.params;
  clothingItem
    .findByIdAndUpdate(
      id,
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
