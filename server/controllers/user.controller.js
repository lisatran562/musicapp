const User = require('./../models/user.model')
// const Show = require('./../models/show.model')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


// Get all
module.exports.getAllUsers = (req, res) => {
    User.find()
        .then(allUsers => {
            res.json({ results: allUsers })
        })
        .catch(err => {
            res.json({ error: err })
        })
}

// Get one
module.exports.oneUser = (req, res) => {
    // get id from params
    User.findOne({_id: req.params.id})
        .then(oneUser => res.json(oneUser))
        .catch(err => res.status(400).json(err))
}

// Create
module.exports.addUser = (req, res) => {
    const newUser = req.body
    User.create(newUser)
        .then(user => res.json(user))
        .catch(err => res.status(400).json(err))
}

// Update - getOne + create
module.exports.updateUser = (req, res) => {
    // grab id from params
    const idFromParams = req.params.id
    const updatedValue = req.body
    // update: criteria, updatedValue, options
    User.findOneAndUpdate(
        {_id : req.params.id}, // or {_id: idFromParams}
        updatedValue,
        {new: true, runValidators: true}
    )
        .then(updatedUser => res.json(updatedUser))
        .catch(err => res.status(400).json(err))
}

// Delete
module.exports.deleteUser = (req, res) => {
    // const idFromParams = req.params.id
    User.deleteOne({_id: req.params.id})
        .then(message => res.json(message))
        .catch(err => res.status(400).json(err))
}

module.exports.register = (req, res) => {
    User.find({email:req.body.email})
        .then(usersWithEmail => {
            console.log('response when finding user', usersWithEmail)
            if(usersWithEmail.length === 0){
                User.create(req.body)
                .then(user => {
                    // when the .then() happens that means that hte user form teh form was successfully created and is stored in that variable 'user' which has info about the user that was just put into the db, including the field _id
                    const userToken = jwt.sign({id: user._id}, process.env.SECRET_KEY);                                            
                    // respond with a cookie called 'usertoken' which contains the JWT from above called userTokenJWT AND also respond with json with info about the user who just got created
                    res
                        .cookie("usertoken", userToken, process.env.SECRET_KEY, {httpOnly: true})
                        .json({ msg: "success!", user: user });           
                })
                .catch(err => res.json(err));
            }else{
                // else --> the email is already taken so we will send back an error message
                res.json({errors: {email:{message:'Email is already taken'}}})
            }
        })
        .catch(err => console.log('error', err))
}

module.exports.login = async (req, res) => {
    console.log('login')
    const user = await User.findOne({ email: req.body.email }); // see if the user exists in db

    if (user === null) {
        // email not found in users collection
        return res.json({error: 'User not found. Who YOU?!'});
    }

    // if we made it this far, we found a user with this email address
    // let's compare the supplied password to the hashed password in the database
    const correctPassword = await bcrypt.compare(req.body.password, user.password);

    if (!correctPassword) {
        // password wasn't a match!
        return res.json({error: 'Password is incorrect!'})
    }

    // if we made it this far, the password was correct
    const userToken = jwt.sign({
        id: user._id,
        firstName: user.firstName
    }, process.env.SECRET_KEY);

    // note that the response object allows chained calls to cookie and json
    res
        .cookie("usertoken", userToken,  {httpOnly: true})                    
        .json({ msg: "success!" });
}

module.exports.logout = (req, res) => {
    res.clearCookie('usertoken');
    res.sendStatus(200);
}

module.exports.getLoggedInUser = (req, res) => {
    // use the info stored in the cookie to get the id of the logged in user and query the db to find a user with that id, and return with info about the logged in user

    const decodedJWT = jwt.decode(req.cookies.usertoken, {complete:true})

    User.findOne({_id: decodedJWT.payload.id})
        .then(foundUser => {
            res.json({results: foundUser})
        })
        .catch(err => {
            res.json(err)
        })
}

module.exports.addShow = async(req, res) => {
    try{
        // show into Show
        const newShow = new Show(req.body)
        const decodedJWT = jwt.decode(req.cookies.usertoken, {complete:true})
        newShow.user = decodedJWT.payload.id
        await newShow.save()

        // pushing the newly added show into User
        const updatedUser = await User.findOneAndUpdate(
            {_id: decodedJWT.payload.id},
            {$push : {shows : newShow._id}},
            {new: true}
        )
        res.json(updatedUser)
    }catch(err) {
        res.status(400).json(err)
    }
}