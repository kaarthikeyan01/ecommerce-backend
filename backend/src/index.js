import { app } from "./App";
import connectDB from "./db";


const PORT=3000 || process.env.PORT;

connectDB()
.then( () => {
    app.listen(PORT, () => {
    console.log(`server is running in ${PORT}`)
    })
}
)
.catch((error) => {
    console.log("MongoDB not connected",error)
})