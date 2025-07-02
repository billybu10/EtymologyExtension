if (JSON.parse(decodeURIComponent(window.location.hash.substring(1))).message) {
    const message = JSON.parse(decodeURIComponent(window.location.hash.substring(1))).message;
    console.log(message);
    
}else{

    const data = JSON.parse(decodeURIComponent(window.location.hash.substring(1))).data;
    const selectionText = JSON.parse(decodeURIComponent(window.location.hash.substring(1))).selectionText;


    if(typeof data[0] === 'string' || data[0] instanceof String){
        console.log(browser.i18n.getMessage("warningIncorrectString"));
        console.log(browser.i18n.getMessage("messagePossibleAlternatives"));
        data.forEach( alternativeString => {
            if(alternativeString !== "")
            console.log(alternativeString)
        });
    }else{
        data.forEach(meaning => {
            var regex = new RegExp("^" + selectionText + "(:[\\d|(a-z)])?$", "i");
            if(regex.exec(meaning.meta.id)){
                console.log("D: ");
                meaning.shortdef.forEach(definition => {
                    console.log(definition);
                });
                console.log("Et: ");
                console.log(meaning.et !== undefined ? meaning.et[0][1] : browser.i18n.getMessage("warningEtymologyNotAvailable"))
            }
            
        });
    }
}
