import express from "express"
import cartCotroller from "../controllers/cartController.js"

const router = express.Router()

router.route("/").get(cartCotroller.getAllCarts).post(cartCotroller.insertCart)

router.route("/:id").put(cartCotroller.updateCart).delete(cartCotroller.deleteCart)

export default router