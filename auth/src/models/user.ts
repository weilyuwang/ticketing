import mongoose from "mongoose";
import { Password } from "../services/password";

// An interface that describes the properties
// that are required to create a new User
interface UserAttrs {
    email: string;
    password: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
    // build static method returns a User Docuemnt of type UserDoc (an instance of User Model)
    build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
// - Instances of Models are documents.
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

/*
 * 1. Create a User Schema
 * Everything in Mongoose starts with a Schema. Each schema maps to a MongoDB collection
 * and defines the shape of the documents within that collection.
 */
const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.password; // remove property of an object (javascript built in method)
                delete ret.__v;
            },
        },
    }
);

// hash the password using pre-save hook
userSchema.pre("save", async function (done) {
    if (this.isModified("password")) {
        const hashed = await Password.toHash(this.get("password"));
        this.set("password", hashed);
    }
    done();
});

/**
 * Statics
 * You can also add static functions to your model.
 * to do so: Add a function property to schema.statics
 */
userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

/*
 * 2. Create a User Model
 * To use our schema definition, we need to convert our userSchema into a UserModel we can work with.
 * To do so, we pass it into mongoose.model(modelName, schema):
 */
const User: UserModel = mongoose.model<UserDoc, UserModel>("User", userSchema);

// const testUesr = User.build({
//     email: "email",
//     password: "password",
// });

export { User };
