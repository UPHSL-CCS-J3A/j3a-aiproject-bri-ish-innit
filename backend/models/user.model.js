import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {type: String, recquired: true},
    email: {type: String, recquired: true},
    password: {type: String, recquired: true},
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
