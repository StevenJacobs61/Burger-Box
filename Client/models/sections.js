import mongoose  from "mongoose";

const SectionsSchema = new mongoose.Schema({ 

    title:{
        type: String,
        required:true,
        maxlength:50 
    },
    available:{
        type:Boolean,
        default:true
    }
}, 
{timestamps:true}
);
export default mongoose.models.Sections || mongoose.model('Sections', SectionsSchema); 