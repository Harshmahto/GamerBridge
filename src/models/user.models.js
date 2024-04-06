import mongoose ,{ Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const userSchema = new Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trime: true,
            index: true
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trime: true
            
        },
        firstName: {
            type: String,
            default: "John",
        },
        lastName: {
            type: String,
            default: "Doe",
        },
        bio: {
            type: String,
            default: "",
        },
        dob: {
            type: Date,
            default: null,
        },
        location: {
            type: String,
            default: "",
        },
        countryCode: {
            type: String,
            default: "",
        },
        phoneNumber: {
            type: String,
            default: "",
        },
        avatar:{
            type: String,
            required :true,

        },
        coverImage:{
            type: String
        },
        password:{
            type: String,
            required: [ true , "Password is Required" ],
        },
        refreshToken:{
            type: String
        }



    },
    {timestamps:true}
)

userSchema.pre("save" , async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect  = async function (password) {
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id : this._id,
            email : this.email,
            username  : this.username,
            fullName : this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}



export const User = mongoose.model("User", userSchema)