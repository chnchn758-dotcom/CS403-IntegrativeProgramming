const petModel = require("../models/petModel");
const {
  validateCreate,
  validateUpdate,
} = require("../validations/petValidation");

async function getAllPets(req, res) {
  const pets = await petModel.findAll();
  return res.status(200).json({ pets });
}

async function getPetById(req, res) {
  const pet = await petModel.findById(req.params.id);
  if (!pet) {
    return res.status(404).json({ error: "Pet not found." });
  }
  return res.status(200).json({ pet });
}

async function createPet(req, res) {
  const errors = validateCreate(req.body);
  if (errors.length) {
    return res.status(400).json({ errors });
  }
  const pet = await petModel.create({ ...req.body, ownerId: req.user.id });
  return res.status(201).json({ pet });
}

async function findOwnedPetOrRespond(req, res) {
  const pet = await petModel.findById(req.params.id);
  if (!pet) {
    res.status(404).json({ error: "Pet not found." });
    return null;
  }
  if (pet.owner_id !== req.user.id && req.user.role !== "admin") {
    res
      .status(403)
      .json({ error: "You do not have permission to modify this pet." });
    return null;
  }
  return pet;
}

async function updatePet(req, res) {
  const errors = validateUpdate(req.body);
  if (errors.length) {
    return res.status(400).json({ errors });
  }
  const pet = await findOwnedPetOrRespond(req, res);
  if (!pet) return;
  const updated = await petModel.update(req.params.id, req.body);
  return res.status(200).json({ pet: updated });
}

async function deletePet(req, res) {
  const pet = await findOwnedPetOrRespond(req, res);
  if (!pet) return;
  await petModel.remove(req.params.id);
  return res.status(200).json({ message: "Pet deleted successfully." });
}

module.exports = { getAllPets, getPetById, createPet, updatePet, deletePet };
