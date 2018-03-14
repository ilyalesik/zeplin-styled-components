import {
    generateLayerStyleObject,
    generateStyleguideTextStylesObject
} from "./style-object-helpers";
import {
    generateName,
    getColorMapByFormat,
    getColorStringByFormat
} from "../utils";

import { REACT_RULES_WITH_COLOR, JSON_SPACING } from "../constants";

function convertStyleObjToStr(styleObj, JSON_SPACING) {
    const space = (new Array(JSON_SPACING + 1)).join(' ');
    return Object.keys(styleObj).reduce((result, current) => `${result}\n${space}${current}: ${styleObj[current]};` , "");
}

function generateReactRule(styleObj, projectColorMap, tag) {
    var selector = styleObj.selector;
    delete styleObj.selector;

    Object.keys(styleObj).forEach(function (prop) {
        if (prop === "mixinEntry") {
            return;
        }

        if (REACT_RULES_WITH_COLOR.includes(prop) && styleObj[prop] in projectColorMap) {
            styleObj[prop] = `colors.${projectColorMap[styleObj[prop]]}`;
        }
    });

    var selectorName = generateName(selector, false);
    var styleObjText = convertStyleObjToStr(styleObj, JSON_SPACING)
        .replace(/"(.+)":/g, "$1:")
        .replace(/: "colors\.(.*)"/g, ": colors.$1");

    return `const ${selectorName} = styled.${tag}\`${styleObjText}\n\`;`;
}

function getStyleguideColorTexts(colorFormat, colors) {
    return colors.map(color => {
        var colorStyleObject = getColorStringByFormat(
            color,
            colorFormat
        );
        return `  ${color.name}: "${colorStyleObject}"`;
    });
}

function getStyleguideColorsCode(options, colors) {
    var { colorFormat } = options;
    var styleguideColorTexts = getStyleguideColorTexts(colorFormat, colors);
    return `const colors = {\n${styleguideColorTexts.join(",\n")}\n};`;
}

function getStyleguideTextStylesCode(options, project, textStyles) {
    var textStylesObj = generateStyleguideTextStylesObject(options, project, textStyles);

    var textStylesStr = JSON.stringify(textStylesObj, null, JSON_SPACING);
    var processedTextStyles = textStylesStr.replace(/"(.+)":/g, "$1:").replace(/: "colors\.(.*)"/g, ": colors.$1");

    return `const textStyles = StyleSheet.create(${processedTextStyles});`;
}

function getLayerCode(project, layer, options) {
    var { showDimensions, colorFormat, defaultValues, defaultTag } = options;

    var layerStyleRule = generateLayerStyleObject({
        layer,
        projectType: project.type,
        densityDivisor: project.densityDivisor,
        showDimensions,
        colorFormat,
        defaultValues
    });

    var cssObjects = [];

    if (Object.keys(layerStyleRule).length > 1) {
        cssObjects.unshift(layerStyleRule);
    }

    return cssObjects.map(cssObj =>
        generateReactRule(
            cssObj,
            getColorMapByFormat(project.colors, options.colorFormat),
            defaultTag
        )
    ).join("\n\n");
}

export {
    getStyleguideColorsCode,
    getStyleguideTextStylesCode,
    getLayerCode
};
