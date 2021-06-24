import consola from 'consola'
import mongoose from 'mongoose';
const port = process.env.PORT || 9000;

const dbConnection = async ()=>{
    mongoose
    .connect(process.env.MONGO_URI, {useCreateIndex: true,useUnifiedTopology:true, useNewUrlParser:true, keepAlive:true,})
    .then(() => consola.success(`Database is connected on port ${port}`));
    mongoose.connection.on("error", err => {
        consola.error(`DB connection error: ${err.message}`);
    }); 
}
export default dbConnection;