const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      default:
        "https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg=",
    },
  },
  {
    timestamps: true, 
  }
);




UserSchema.pre('save',async function (next) {
  if (!this.isModified) {
   next();

  }

  const salt = await bcrypt.genSalt(10);
  this.password =  await bcrypt.hash(this.password,salt);
  
  
})

const User = mongoose.model("User", UserSchema);
module.exports = User;
