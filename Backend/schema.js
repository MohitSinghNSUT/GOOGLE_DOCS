const mongoose=require("mongoose");
const schema={
    _id:{
        type:String
    },
    data:{
        type:Object
    }
}
const documentSchema=new mongoose.Schema(schema);
const document=mongoose.model('Document',documentSchema);
module.exports=document