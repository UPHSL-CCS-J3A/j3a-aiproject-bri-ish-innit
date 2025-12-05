import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    profilePicture: {type: String, default: ''},
    displayName: {type: String, default: ''},
    recommendationTags: [{type: String}],
    questionnairePreferences: [{type: String}],
    supportIndie: {type: Boolean, default: true},
    allowAdultContent: {type: Boolean, default: false},
    favoriteMovies: [{type: Number}],
    likedMovies: [{type: Number}],
    bookmarkedMovies: [{type: Number}],
}, {
    timestamps: true
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
