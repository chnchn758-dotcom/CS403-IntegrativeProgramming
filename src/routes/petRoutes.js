const express = require('express');
const petController = require('../controllers/petController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /pets:
 *   get:
 *     summary: List all pets
 *     tags: [Pets]
 *     responses:
 *       200:
 *         description: Returns an array of pets
 */
router.get('/pets', petController.getAllPets);

/**
 * @swagger
 * /pets/{id}:
 *   get:
 *     summary: Get a single pet by id
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Returns the pet
 *       404:
 *         description: Pet not found
 */
router.get('/pets/:id', petController.getPetById);

/**
 * @swagger
 * /pets:
 *   post:
 *     summary: Create a new pet (logged-in user becomes the owner)
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, species]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Shadow
 *               species:
 *                 type: string
 *                 example: Dog
 *               breed:
 *                 type: string
 *                 example: Husky
 *               age:
 *                 type: number
 *                 example: 2
 *     responses:
 *       201:
 *         description: Pet created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Missing or invalid access token
 */
router.post('/pets', requireAuth, petController.createPet);

/**
 * @swagger
 * /pets/{id}:
 *   put:
 *     summary: Update a pet (must be the owner or an admin)
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               species:
 *                 type: string
 *               breed:
 *                 type: string
 *               age:
 *                 type: number
 *     responses:
 *       200:
 *         description: Pet updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Missing or invalid access token
 *       403:
 *         description: Not the owner of this pet
 *       404:
 *         description: Pet not found
 */
router.put('/pets/:id', requireAuth, petController.updatePet);

/**
 * @swagger
 * /pets/{id}:
 *   delete:
 *     summary: Delete a pet (must be the owner or an admin)
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pet deleted
 *       401:
 *         description: Missing or invalid access token
 *       403:
 *         description: Not the owner of this pet
 *       404:
 *         description: Pet not found
 */
router.delete('/pets/:id', requireAuth, petController.deletePet);

module.exports = router;
