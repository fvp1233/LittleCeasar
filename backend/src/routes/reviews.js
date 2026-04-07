import express from "express"
import reviewsController from "../controllers/reviewsController.js"

//Router nos ayuda a colocar los metodos que tendra el endpoint

const router = express.Router()

//Los separo porque el actualizar y el eliminar necesita el id
router.route("/").get(reviewsController.getReviews).post(reviewsController.insertReview)

router.route("/:id").put(reviewsController.updateReview).delete(reviewsController.deteleReview)

export default router