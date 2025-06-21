import mongoose from "mongoose"

const connectDB = async () => {
    try {
        const isConnected=await mongoose.connect(`${ process.env.DATABASE_URL }`)
    } catch (error) {
        console.log("database not connected",error)
    }

}

export default connectDB