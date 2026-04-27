import express from "express"
import pizzaRoutes from "./src/routes/pizza.js"
import branchesRoutes from "./src/routes/branches.js"
import employeesRoutes from "./src/routes/employees.js"
import reviewRoutes from "./src/routes/reviews.js"
import customerRoutes from "./src/routes/customers.js"
import registerCustomers from "./src/routes/registerCostumers.js"
import cookieParser from "cookie-parser"
import registerEmployee from "./src/routes/registerEmployee.js"
import adminRoutes from "./src/routes/admins.js"
import registerAdmins from "./src/routes/registerAdmin.js"
import loginCustomersRoutes from "./src/routes/loginCustomer.js"
import logoutRoutes from "./src/routes/logout.js"
import cors from 'cors'
import recoveryPasswordRoutes from "./src/routes/recoveryPassord.js"

//Creo la constante para utilizar la libreria de express en todos lados
const app = express();

//Instalar la libreria npm i cors
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}))

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
app.use("/api/registerEmployee",registerEmployee)
app.use("/api/admins", adminRoutes)
app.use("/api/registerAdmin", registerAdmins)
app.use("/api/loginCustomers",loginCustomersRoutes )
app.use("/api/logout",logoutRoutes )
app.use("/api/recoveryPassword", recoveryPasswordRoutes)

export default app;