import mongoose from 'mongoose';

const mongoUrl:string = process.env.MONGO_URL || "mongodb://db:27017/users";
mongoose.connect(mongoUrl);

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    }
})

const User = mongoose.model('User', userSchema);
export default User;