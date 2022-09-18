import mongoose from "mongoose";

const ExtrasSchema = new mongoose.Schema({

    extraTopping:{
        type:[
            {
                
                title: {type: String, required: true, maxlength: 50},
                price: {type: Number, required: true, maxlength: 6},
                available: {type: Boolean, default: true, }
            },
        ],
    },
    upgrade:{
        type:[
            {
                title: {type: String, required: true, maxlength: 50},
                price: {type: Number, required: true, maxlength: 6},
                available: {type: Boolean, default: true, }
            }
        ],
    },
},
{timestamps: true},
);

export default mongoose.models.Extras || mongoose.model('Extras', ExtrasSchema);