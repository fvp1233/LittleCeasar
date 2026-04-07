import express from "express"
import pizzaRoutes from "./src/routes/pizza.js"
import branchesRoutes from "./src/routes/branches.js"
import employeesRoutes from "./src/routes/employees.js"
import reviewRoutes from "./src/routes/reviews.js"

//Creo la constante para utilizar la libreria de express en todos lados
const app = express();

//Para que la API acepte json
app.use(express.json());

app.use("/api/pizzas", pizzaRoutes);
app.use("/api/branches", branchesRoutes)
app.use("/api/employee", employeesRoutes)
app.use("/api/reviews", reviewRoutes)

export default app;