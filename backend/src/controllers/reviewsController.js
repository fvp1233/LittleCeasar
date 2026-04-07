//Aqui en el controlador vamos a definir las funciones que ejecutaran los metodos get, post, put y delete
//#1 Creo un array de funciones vacio
const reviewsController = {};

//#2 importo el Schema de la coleccion que voy a ocupar
import reviewsModel from "../models/reviews.js";

//Select
reviewsController.getReviews = async (req, res) => {
  try {
    const reviews = await reviewsModel.find();
    return res.status(200).json(reviews);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Insert
reviewsController.insertReview = async (req, res) => {
  try {
    let { idEmployee, idPizza, rating, comment } = req.body;

    comment = comment?.trim();

    if (!rating || !comment) {
      return res.status(400).json({ message: "Field required" });
    }

    if (rating < 1) {
      return res.status(400).json({ message: "rating must be valid" });
    }

    const newReview = new reviewsModel({
      idEmployee,
      idPizza,
      rating,
      comment,
    });

    await newReview.save();
    return res.status(201).json({ message: "Review saved" });
  } catch (error) {
    console.log("error" + error);
    return res.status(400).json({ message: "Internal server error" });
  }
};

//Delete
reviewsController.deteleReview = async (req, res) => {
  try {
    const deleteReview = await reviewsModel.findByIdAndDelete(req.params.id);
    if (!deleteReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    return res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Update
reviewsController.updateReview = async (req, res) => {
  //#1 Solicitamos los nuevos datos
  try {
    let { idEmployee, idPizza, rating, comment } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ message: "Field required" });
    }

    if (rating < 1) {
      return res.status(400).json({ message: "rating must be valid" });
    }

    const reviewUpdated = await reviewsModel.findByIdAndUpdate(
      req.params.id,
      {
        idEmployee,
        idPizza,
        rating,
        comment,
      },
      { new: true },
    );
    if (!reviewUpdated) {
      return res.status(404).json({ message: "Review not found" });
    }
    return res.status(200).json({ message: "Review updated" });
  } catch (error) {
    console.log("error" +error)
    return res.status(500).json({message: "Internal server error"})
  }
};

export default reviewsController;
