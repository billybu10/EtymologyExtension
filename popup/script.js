function parseTextWithTokensToHTML(text){
    let parsedText = text.replaceAll("{b}", "<b>");
    parsedText = parsedText.replaceAll("{\/b}", "</b>");
    parsedText = parsedText.replaceAll("{bc}", "<b>: </b>&nbsp;");
    parsedText = parsedText.replaceAll("{inf}", "<sub>");
    parsedText = parsedText.replaceAll("{\/inf}", "</sub>");
    parsedText = parsedText.replaceAll("{it}", "<i>");
    parsedText = parsedText.replaceAll("{\/it}", "</i>");
    parsedText = parsedText.replaceAll("{ldquo}", "&ldquo;");
    parsedText = parsedText.replaceAll("{rdquo}", "&rdquo;");
    parsedText = parsedText.replaceAll("{sc}", "<span style=\"font-variant: small-caps;\">");
    parsedText = parsedText.replaceAll("{\/sc}", "</span>");
    parsedText = parsedText.replaceAll("{sup}", "<sup>");
    parsedText = parsedText.replaceAll("{\/sup}", "</sup>");

    parsedText = parsedText.replaceAll("{gloss}", "&#91;");
    parsedText = parsedText.replaceAll("{\/gloss}", "&#93;");
    parsedText = parsedText.replaceAll("{parahw}", "<b><span style=\"font-variant: small-caps;\">");
    parsedText = parsedText.replaceAll("{\/parahw}", "</span></b>");
    parsedText = parsedText.replaceAll("{phrase}", "<b><i>");
    parsedText = parsedText.replaceAll("{\/phrase}", "</i></b>");
    parsedText = parsedText.replaceAll("{qword}", "<i>");
    parsedText = parsedText.replaceAll("{\/qword}", "</i>");
    parsedText = parsedText.replaceAll("{wi}", "<i>");
    parsedText = parsedText.replaceAll("{\/wi}", "</i>");

    parsedText = parsedText.replaceAll("{dx}", "&#151; &nbsp;");
    parsedText = parsedText.replaceAll("{\/dx}", "");
    parsedText = parsedText.replaceAll("{dx_def}", "&#40;");
    parsedText = parsedText.replaceAll("{\/dx_def}", "&#41;");
    parsedText = parsedText.replaceAll("{dx_ety}", "&#151; &nbsp;");
    parsedText = parsedText.replaceAll("{\/dx_ety}", "");
    parsedText = parsedText.replaceAll("{ma}", "&nbsp; &#151; more at &nbsp;");
    parsedText = parsedText.replaceAll("{\/ma}", "");
    parsedText = parsedText.replaceAll(/{a_link\|([^}|]*)}/g, (match, field2) => {
          const linkText = field2.trim();
          return `<a href="https://www.merriam-webster.com/dictionary/${linkText}">${linkText}</a>`;
    });

    parsedText = parsedText.replaceAll( /{(d_link|i_link|et_link|mat)\|([^}|]*)\|([^}|]*)}/g, (match, type, field2, field3) => {
          const linkText = field2.trim();
          const target = field3.trim() || linkText;
          switch(type) {
            case 'i_link':
              return `<a href="https://www.merriam-webster.com/dictionary/${target}"><i>${linkText}</i></a>`;
            case 'et_link':
              return `<a href="https://www.merriam-webster.com/dictionary/${target}" class="etymology">${linkText}</a>`;
            case 'mat':
              return `<a href="https://www.merriam-webster.com/dictionary/${target}" class="more-at">${linkText}</a>`;
            default:
              return `<a href="https://www.merriam-webster.com/dictionary/${target}">${linkText}</a>`;
          }
    });

    parsedText = parsedText.replaceAll(/{sx\|([^}|]*)\|([^}|]*)\|([^}|]*)}/g, (match, field2, field3, field4) => {
          const linkText = field2.trim();
          const target = field3.trim() || linkText;
          const senseInfo = field4.trim();
          return `<a href="https://www.merriam-webster.com/dictionary/${target}">${linkText}</a> ${senseInfo}`;
    });

    parsedText = parsedText.replaceAll( /{dxt\|([^}|]*)\|([^}|]*)\|([^}|]*)}/g, (match, field2, field3, field4) => {
          const linkText = field2.trim();
          let target, extra = '';
          const field4Content = field4.trim().toLowerCase();
          
          if (field4Content.includes('illustration')) {
            target = `art-${field3.trim()}`;
            extra = 'illustration';
          } else if (field4Content.includes('table')) {
            target = `table-${field3.trim()}`;
          } else {
            target = field3.trim() || linkText;
            extra = field4.trim();
          }
          
          const link = `<a href="https://www.merriam-webster.com/dictionary/${target}">${linkText}</a>`;
          return extra && !field4Content.includes('table') ? `${link} ${extra}` : link;
    });



    return parsedText;
}


const messageDiv = document.getElementById("message");

const selectionText = JSON.parse(decodeURIComponent(window.location.hash.substring(1))).selectionText;
document.getElementById("mainTitle").innerText += " " + selectionText;

if (JSON.parse(decodeURIComponent(window.location.hash.substring(1))).message) {
    const message = JSON.parse(decodeURIComponent(window.location.hash.substring(1))).message;
    messageDiv.innerText = message;
    
}else{
    const meaningList = document.getElementById("meanings");

    const data = JSON.parse(decodeURIComponent(window.location.hash.substring(1))).data;


    if(typeof data[0] === 'string' || data[0] instanceof String){
        messageDiv.innerText = browser.i18n.getMessage("warningIncorrectString") + " " + browser.i18n.getMessage("messagePossibleAlternatives");
        data.forEach( alternativeString => {
            if(alternativeString !== ""){
                var meaningListItem = document.createElement("li");
                meaningListItem.setAttribute("class", "alternative");
                meaningListItem.innerText = alternativeString;
                meaningList.appendChild(meaningListItem);
            }
        });
    }else{
        
        data.forEach(meaning => {
            var regex = new RegExp("^" + selectionText + "(:[\\d|(a-z)])?$", "i");
            if(regex.exec(meaning.meta.id)){
                var meaningListItem = document.createElement("li");
                var definitionDiv = document.createElement("div");
                var tempDefinition = "";
                meaning.shortdef.forEach(definition => {
                    tempDefinition += definition;
                });
                definitionDiv.setAttribute("class", "definition");
                definitionDiv.innerHTML = "Definition: " + parseTextWithTokensToHTML(tempDefinition);
                meaningListItem.appendChild(definitionDiv);
                var etymologyDiv = document.createElement("div");
                etymologyDiv.setAttribute("class", "etymology");
                var tempEtymology = "";
                tempEtymology = meaning.et !== undefined ? parseTextWithTokensToHTML(meaning.et[0][1]) : browser.i18n.getMessage("warningEtymologyNotAvailable");
                etymologyDiv.innerHTML = "Etymology: " + tempEtymology;
                meaningListItem.appendChild(etymologyDiv);
                meaningList.appendChild(meaningListItem);


            }
            
        });
    }
}
