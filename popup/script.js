let gettingData = browser.cookies.get({
    url: browser.extension.getURL(""),
    name: "etymologydata",
  });
  
gettingData.then((dataString) => {
    if (dataString) {
        let data = JSON.parse(dataString.value);
        if(typeof data[0] === 'string' || data[0] instanceof String){
            console.log(browser.i18n.getMessage("warningIncorrectString"));
            console.log(browser.i18n.getMessage("messagePossibleAlternatives"));
            data.forEach( alternativeString => {
                if(alternativeString !== "")
                console.log(alternativeString)
            });
        }else{
            data.forEach(meaning => {
                var regex = new RegExp("^" + info.selectionText + "(:[\\d|(a-z)])?$", "i");
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
});


