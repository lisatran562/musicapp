const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        minLength: [3, "First name must be at least 3 characters"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        minLength: [3, "Last name must be at least 3 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        validate: {
            validator: val => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
            message: "Please enter a valid email"
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Password must be at least 8 characters"]
    }, 
}, {timestamps: true})

// creates a virtual field called 'confirm' that is used to validate if the password matches --> the getter and setter above are just creating temporary fields for _confirm
UserSchema.virtual('confirm')
    .get(() => this._confirm)
    .set(value => this._confirm = value);

// before (pre) running the other validations on the model and saving the user to the db, validate the user object's password matches.  If they don't match, this.invalidate() will create a validation error message
UserSchema.pre('validate', function(next) {
    if (this.password !== this.confirm) {
        this.invalidate('confirm', 'Passwords must match');
    }
    next(); // after the above process is done, go to the next usual step
});

// before (pre) saving the user to the db (this means we have passed the validations), hash the user's password (encrypt it)
UserSchema.pre('save', function(next) {
    bcrypt.hash(this.password, 10)
        .then(hash => {
            this.password = hash;
            next();
        });
});

module.exports = mongoose.model('User', UserSchema)
// same as const User = mongoose.model('User', UserSchema);
// module.exports = User;