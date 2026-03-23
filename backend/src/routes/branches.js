import express from "express";
import branchesController from "../controllers/branchesController.js";

//Router nos ayuda a colocar los metodos que tendra el endpoint

const router = express.Router();

//Los separo porque el actualizar y el eliminar necesita el id
router.route("/").get(branchesController.getBranches).post(branchesController.insertBranches)

router.route("/:id").delete(branchesController.deleteBranch).put(branchesController.updateBranch)

export default router;