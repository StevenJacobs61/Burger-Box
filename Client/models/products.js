import mongoose  from "mongoose";

const ProductsSchema = new mongoose.Schema({ 
    img:{
        type: String,
    },
    
    title:{
        type: String,
        required:true,
        maxlength:50
    },
    desc:{
        type:String,
        maxlength:300 
    },
    price:{
        type:Number,
        maxlength:6,
        minlength:1
    },
    section:{
        type: String,
        maxlength:20,
        required:true
    },
    extraSection:{
        type:[],
    },
    upgrade:{
        type:Boolean,
        default: false,
    },
    available:{
        type: Boolean, 
        default: true, 
    },
    stripeId:{
        type:String,
        required:true
    }
}, 
{timestamps:true}
);
export default mongoose.models.Products || mongoose.model('Products', ProductsSchema); 