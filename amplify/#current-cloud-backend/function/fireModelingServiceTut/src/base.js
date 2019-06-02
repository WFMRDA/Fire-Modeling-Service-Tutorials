var base = {

    validate: (defaults) => {
        for (const key in defaults) {
            if (key != 'auth' && defaults.hasOwnProperty(key)) {
                const element = defaults[key];
                if(element == undefined){
                    throw key + ' cannot be empty'; 
                }
            }
        }
        return true;
    }, 
}
module.exports =  base;
  