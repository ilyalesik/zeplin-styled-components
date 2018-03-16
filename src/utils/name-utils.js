function lowercaseFirst(s) {
    return s.charAt(0).toLowerCase() + s.substring(1);
}

export function uppercaseFirst(s) {
    return s.charAt(0).toUpperCase() + s.substring(1);
}

function joinTokens(components, isLowercaseFirst = true) {
    var name = components.map(uppercaseFirst).join("");
    return isLowercaseFirst ? lowercaseFirst(name) : name;
}

function tokensForString(str) {
    var tokenizer = /\d+|[a-z]+|[A-Z]+(?![a-z])|[A-Z][a-z]+/g;

    var matchResult = str.match(tokenizer);
    if (!matchResult) {
        return ["invalid", "name"];
    }

    return matchResult.map(function (token) {
        return token.toLowerCase();
    });
}

export function generateName(name, isLowercaseFirst) {
    return joinTokens(tokensForString(name), isLowercaseFirst);
}

export function camelCaseToDash(str) {
    return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()
}