async function isValueAlreadyTaken(schema,field,value){
        try{
            const searchFilter={};
            searchFilter[field]=value;
            const doesExist = await schema.exists(searchFilter);
            console.log("doesExist " ,doesExist)
            return doesExist;
        }
        catch(err){
            console.log(err);
        }
}

async function getDocumentByValue(schema,field,value){
        try{
            const searchFilter={};
            searchFilter[field]=value;
            const dbUser = await schema.findOne(searchFilter);
            return dbUser; 
        }catch(err){
            console.log(err);
        }
}

module.exports = dao = {
    isValueAlreadyTaken,
    getDocumentByValue
}