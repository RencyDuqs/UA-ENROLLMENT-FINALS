const User = require("../models/User-Model.js");
const Enroll = require("../models/Enrollment-Model.js");
const bcryptjs = require("bcryptjs");
const auth = require("../auth.js");

module.exports.registerUser = (req, res) => {
    let newUser = new User ({
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        email: req.body.email,
        contactNumber: req.body.contactNumber,
        password: bcryptjs.hashSync(req.body.password, 10)
    })

  
    

    return newUser.save().then (result => {
        res.send ({
            code : "REGISTRATION-SUCCESS",
            message : "You are now registered!",
            result : result
        })
    })
    .catch(error => {
        res.send ({
            code : "REGISTRATION-FAILED",
            message : "We've encountered an error during the registration. Please try again!",
            result : error
        })
    })
}


// User Login
module.exports.loginUser = (req, res) => {
    let {email, password} = req.body;
    return User.findOne({email: req.body.email}).then(result => {
        if(result == null) {
            return res.send ({
                code : "USER-NOT-REGISTERED",
                message : "Please register to login."
            })
        }else {
            const isPasswordCorrect = bcryptjs.compareSync(password, result.password);

            if(isPasswordCorrect) {
                return res.send ({
                    code : "USER-LOGIN-SUCCESS",
                    token : auth.createAccessToken(result)
                })
            }else {
                res.send ({
                    code : "PASSWORD-INCORRECT",
                    message : "Password is not correct. Please try again."
                })
            }
        }
    })
}



// Check email if existing
module.exports.checkEmail = (req,res) => {
    let {email, password} = req.body;
    return User.find({email: email}).then(result => {
        if(result.length > 0 ) {
            return res.send ({
                code : "EMAIL-EXIST",
                message : "The user is not registered."
            })
        } else {
            res.send({
                code: "EMAIL-NOT-EXISTING",
                message : "The user is not registered."
            })
        }
    })
}


// Check user details
module.exports.getProfile = (req, res) => {
    const {id} = req.user;
    return User.findById(id).then(result => {
        if(result == null || result.length === 0){
            return res.send({
                code: "USER-NOT-FOUND",
                message: "Cannot find user with the provided ID."
            })
        }else{
            result.password = "*****";
            return res.send({
                code: "USER-FOUND",
                message: "A user was found.",
                result: result
            })
        }
    })
}



//enroll a user
module.exports.enroll = (req, res) => {
    const {id} = req.user;

    let newEnrollment = new Enroll({
        userId: id,
        enrolledCourse: req.body.enrolledCourse,
        totalPrice: req.body.totalPrice
    })

    return newEnrollment.save().then((result, err) => {
        if(err){
            res.send({
                code: "ENROLLMENT-FAILED",
                messsage: "There was a problem during your enrollment, please try again!"
            })
        }else{
            res.send({
                code: "ENROLLMENT-SUCCESSFUL",
                messsage: "Congratulations, You are now Enrolled!",
                result: result
            })

        }

    })
}