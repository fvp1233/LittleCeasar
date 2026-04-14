import express from "express"
import pizzaRoutes from "./src/routes/pizza.js"
import branchesRoutes from "./src/routes/branches.js"
import employeesRoutes from "./src/routes/employees.js"
import reviewRoutes from "./src/routes/reviews.js"
import customerRoutes from "./src/routes/customers.js"
import registerCustomers from "./src/routes/registerCostumers.js"
import cookieParser from "cookie-parser"

//Creo la constante para utilizar la libreria de express en todos lados
const app = express();

//Para que la cookie maneje cookies
app.use(cookieParser());

//Para que la API acepte json
app.use(express.json());

app.use("/api/pizzas", pizzaRoutes);
app.use("/api/branches", branchesRoutes)
app.use("/api/employee", employeesRoutes)
app.use("/api/reviews", reviewRoutes)
app.use("/api/customers", customerRoutes)
app.use("/api/registerCustomer", registerCustomers)
//Intalar la liberia npm cookie-parse para el registro ya que usa cookies

export default app;