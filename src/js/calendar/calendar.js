const os = require('os')
const fs = require('fs')
const path = require('path');
const contrast = require('wcag-contrast')


const folderPath = path.join(os.homedir(), 'AppData', 'Local', 'Galaxy-Widgets');

window.addEventListener("DOMContentLoaded", () => {
    const containerMain = document.getElementById("container-main");

    const secondaryColors = [
        [179, 179, 179],
        [142, 142, 142]
    ];

    const textColors = [
        [0, 0, 0],
        [250, 250, 250]
    ];

    // change color based on Setting
    const colorData = JSON.parse(fs.readFileSync(path.join(folderPath, 'color.json'), 'utf8'));

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

    const day = document.getElementsByClassName('day')

    containerMain.style.background = `linear-gradient(135deg, rgb(${colorData.red}, ${colorData.green}, ${colorData.blue}) 0%, rgb(${colorData.red - 35}, ${colorData.green - 35}, ${colorData.blue - 35}) 100%)`;

    for (let i = 0; i < day.length; i++) {
        day[i].style.color = secondaryColor;
    }

    // get current date as variable
    const currentDate = new Date();

    // array of month names for settings #month
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // days is the class for every day (1 - 31)
    const days = document.getElementsByClassName("day");

    // get the current date as example today is 15th september of 1993 it will output 15
    const dayOfMonth = currentDate.getDate()

    // adds the current-day class to the div which is the number in order of current day
    days[dayOfMonth - 1].classList.add('current-day')
    const currentDay = document.getElementsByClassName('current-day')
    currentDay[0].style.color = 'black';

    // Get the current month (0 - 11)
    const currentMonth = currentDate.getMonth();

    // Create a new Date object for the first day of the next month
    // By setting the day to 0, we get the last day of the current month
    const nextMonthFirstDay = new Date(currentDate.getFullYear(), currentMonth + 1, 0);

    // Get the day of the month from the first day of the next month
    const numDaysInMonth = nextMonthFirstDay.getDate();

    // checks if theres an 31th as example or 30th 31th in this month and so one and if there isnt it hides them
    for (let i = 0; i < 31 - numDaysInMonth; i++) {
        const a = 30 - i
        days[a].style.display = "none"
    }


    // Function to calculate how many days until the last Monday
    function daysSinceLastMonday(inputDate) {
        const date = new Date(inputDate);
        const today = date.getDay(); // 0 (Sunday) to 6 (Saturday)

        // Calculate the number of days since the last Monday (0-indexed)
        const daysSinceMonday = (today + 6) % 7;

        // Calculate the date of the last Monday
        const lastMonday = new Date(date);
        lastMonday.setDate(date.getDate() - daysSinceMonday);

        // Calculate the time difference in milliseconds
        const timeDifference = date - lastMonday;

        // Calculate the number of days by dividing the milliseconds by the number of milliseconds in a day
        const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        return daysAgo;
    }

    // Calculate the 1st day of the current month
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    // Calculate how many days until the last Monday before the 1st day of the month
    const daysUntilMonday = daysSinceLastMonday(firstDayOfMonth);

    // Get a reference to the container element by its ID
    const container = document.getElementById('container-calendar');

    // Check if the container element exists

    // Create filler divs
    for (let i = 0; i < daysUntilMonday; i++) {
        const fillerDiv = document.createElement('div');
        fillerDiv.className = 'filler';
        container.insertBefore(fillerDiv, container.firstChild);
    }

    // adds the descriptions for the days so M = monday | S = sunday | S = saturday ...
    for (let i = 0; i < 7; i++) {
        const weekDays = ["S", "S", "F", "T", "W", "T", "M"];
        const weekDayDiv = document.createElement('div');
        weekDayDiv.className = 'weekdays';
        weekDayDiv.textContent = weekDays[i];
        container.insertBefore(weekDayDiv, container.firstChild);
    }

    // gets every 7th day (saturday) and adds them to the saturday class so they have the color red
    const allDivs = container.getElementsByTagName('div');
    for (let i = 6; i < allDivs.length; i += 7) {
        allDivs[i].classList.add('sunday');
    }

    // gets the month span
    const month = document.getElementById("month");

    // changes the text of #month to the current month name
    month.innerHTML = monthNames[currentDate.getMonth()]

})