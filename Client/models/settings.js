import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true,
        maxlength:20,
    },
    colTime:{
        type:Number,
        max: 90,
        min: 1,
    },
    delTime:{
        type:Number,
        max:180,
        min: 10,
    },
    offline:{
        type:Boolean,
        default:false,
    },
    banner:{
        type:String,
    },
    bannerOn:{
        type:Boolean,
        default:true,
    },
    notice:{
        type:String,  
    },
    noticeOn:{
        type:Boolean,
        default:true,
    },
    del:{
        type:Boolean,
    }
    
}, {timestamps: true}
);

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);