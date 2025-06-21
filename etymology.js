const API_KEY = "";
const API_URL = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/"
const API_INFIX = "?key="

browser.contextMenus.create(
    {
        id: "check-etymology",
        title: browser.i18n.getMessage("contextMenuItemEtymologyRequest"),
        contexts: ["selection"],
    },
    () => void browser.runtime.lastError ,
);

browser.contextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
        case "check-etymology":

        fetch(API_URL + info.selectionText + API_INFIX + API_KEY)
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.length == 0) {
                alert(browser.i18n.getMessage("warningIncorrectString"));
            }else if(typeof data[0] === 'string' || data[0] instanceof String){
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
            
        })
        .catch(error => {
            console.error('Error:', error);
        });
        break;
    }
});