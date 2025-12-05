import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    profilePicture: {type: String, default: ''},
    displayName: {type: String, default: ''},
    recommendationTags: [{type: String}],
    supportIndie: {type: Boolean, default: true},
    allowAdultContent: {type: Boolean, default: false},
}, {
    timestamps: true
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
