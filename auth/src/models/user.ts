import mongoose from "mongoose";

// An interface that describes the properties
// that are required to create a new User
interface UserAttrs {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const UserModel = mongoose.model("User", userSchema);

class User extends UserModel {
    constructor(attrs: UserAttrs) {
        super(attrs);
    }
}

export { User };
