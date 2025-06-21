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
            }else{
                browser.cookies.set({
                    url: browser.extension.getURL(""),
                    name: "etymologydata",
                    value: JSON.stringify(data),
                });

                let createData = {
                    type: "detached_panel",
                    url: "popup/index.html",
                    width: 250,
                    height: 100,
                  };
                let creating = browser.windows.create(createData);
                  
            }
            
        })
        .catch(error => {
            console.error('Error:', error);
        });
        break;
    }
});