import mongoose from "mongoose";

const OrdersSchema = new mongoose.Schema({

details:{  
    address:{
        street:{
            type:String,
            maxlength:100,
        },
        postcode:{
            type:String,
            maxlength:9,
            minlength:5
        },
        instructions: {
            type: String,
            maxlength: 75
        }

    },
    name:{
        type:String,
        maxlength:15,
        required:true,
    },
    number:{
        type:Number,
        maxlength:15,
        minlength:10,
        required:true,
    },
    email:{
        type:String,
        maxlength: 50,
        required:true,
    }  
},
orders:{
    type:[Object],
    required:true
},
total:{
    type:Number,
    maxlength:6,
    required:true
   },
delivery:{
    type: Boolean,
    required:true
   },
status:{
    type:Number,
    maxlength:1,
    required:true
  },
},
{timestamps: true},
);
export default mongoose.models.Orders || mongoose.model('Orders', OrdersSchema);