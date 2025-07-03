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
            throw new Error('Network response was not correct');
            }
            return response.json();
        })
        .then(async data => {
            if (data.length == 0) {
                alert(browser.i18n.getMessage("warningIncorrectString"));

                let createData = {
                    type: "detached_panel",
                    url: "popup/index.html"+ "#" + encodeURIComponent(JSON.stringify({"message": browser.i18n.getMessage("warningIncorrectString"), "selectionText": info.selectionText})),
                    width: 600,
                    height: 900,    
                  };
                let creating = browser.windows.create(createData);

            }else{

                let createData = {
                    type: "detached_panel",
                    url: "popup/index.html"+ "#" + encodeURIComponent(JSON.stringify({"data": data, "selectionText": info.selectionText })),
                    width: 600,
                    height: 900,    
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