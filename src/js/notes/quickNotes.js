const os = require('os')
const fs = require('fs')
const path = require('path');
const contrast = require('wcag-contrast')

const folderPath = path.join(os.homedir(), 'AppData', 'Local', 'Galaxy-Widgets');

window.addEventListener("DOMContentLoaded", () => {
    // change color based on Setting
    const colorData = JSON.parse(fs.readFileSync(path.join(folderPath, 'color.json'), 'utf8'));

    const containerMain = document.getElementById("container-main");

    const textarea = document.querySelector('textarea')

    // Check its not black
    containerMain.style.background = `linear-gradient(135deg, rgb(${colorData.red}, ${colorData.green}, ${colorData.blue}) 0%, rgb(${colorData.red - 35}, ${colorData.green - 35}, ${colorData.blue - 35}) 100%)`;

    const secondaryColors = [
        [179, 179, 179],
        [142, 142, 142]
    ];

    const textColors = [
        [0, 0, 0],
        [250, 250, 250]
    ];

    // change color based on Setting

    function findBetterContrast(rgb1, rgb2) {
        const contrast1 = contrast.rgb(rgb1, [colorData.red, colorData.green, colorData.blue])
        const contrast2 = contrast.rgb(rgb2, [colorData.red, colorData.green, colorData.blue])
        if (contrast1 > contrast2) {
            return `rgb(${rgb1[0]}, ${rgb1[1]}, ${rgb1[2]})`;
        } else {
            return `rgb(${rgb2[0]}, ${rgb2[1]}, ${rgb2[2]})`;
        }
    }

    const textColor = findBetterContrast(textColors[0], textColors[1])
    const secondaryColor = findBetterContrast(secondaryColors[0], secondaryColors[1])
   
    containerMain.style.color = textColor;
    textarea.style.color = textColor;

    // Create a new style rule for textarea::placeholder
    const styleSheet = document.styleSheets[0]; // You might need to adjust the index based on your stylesheet
    const rule = `textarea::placeholder { color: ${secondaryColor}; }`; // Change the color to your desired placeholder color

    // Insert the new style rule into the stylesheet
    styleSheet.insertRule(rule, styleSheet.cssRules.length);
})