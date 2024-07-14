let myChart;

function initChart() {
    const last7 = document.querySelector("#last7");
    const last14 = document.querySelector("#last14");
    const last30 = document.querySelector("#last30");
    const last360 = document.querySelector("#last360");
    const artistName = localStorage.getItem("artist");

    const itemsPerArtist = items_LS ? items_LS.filter(item => item.artist === artistName) : items.filter(item => item.artist === artistName);
    const soldItems = itemsPerArtist.filter(item => item.dateSold);

    const chartElement = document.getElementById('myChart');
    const defaultDays = 14;

    const data = generateChartData(soldItems, defaultDays);
    const config = createChartConfig(data);

    if (!myChart) {
        myChart = new Chart(chartElement, config);
    }

    setupButtonListeners([last7, last14, last30, last360], soldItems);
    last14.click(); // Resets the chart for the new user.
}

function createChartConfig(data) {
    return {
        type: 'bar',
        data: data,
        options: {
            maintainAspectRatio: false,
            indexAxis: 'y'
        }
    };
}

function generateChartData(soldItems, days) {
    const dateLabels = generateDates(days);
    const daysData = dateLabels.map(label => {
        let sum = 0;
        soldItems.forEach(item => {
            if (formatDate(item.dateSold) === label) {
                sum += item.priceSold;
            }
        });
        return sum;
    });

    const daysLabels = dateLabels.map(label => label.slice(0, 2));

    return {
        labels: daysLabels,
        datasets: [{
            axis: 'y',
            label: 'Amount',
            data: daysData,
            fill: false,
            backgroundColor: ['#A16A5E'],
            hoverBackgroundColor: ["#D44C2E"],
            barThickness: 8
        }]
    };
}

function setupButtonListeners(buttons, soldItems) {
    document.addEventListener("click", function (e) {
        const { target } = e;
        const days = getDaysFromButton(target, buttons);

        if (days) {
            updateActiveButton(target, buttons);

            const data = generateChartData(soldItems, days);
            updateChart(data);
        }
    });
}

function getDaysFromButton(target, buttons) {
    const buttonMapping = {
        "#last7": 7,
        "#last14": 14,
        "#last30": 30,
        "#last360": 360
    };

    for (const button of buttons) {
        if (target === button) {
            return buttonMapping[`#${button.id}`];
        }
    }

    return null;
}

function updateActiveButton(target, buttons) {
    const activeBtn = document.querySelector(".days-btns .active");
    if (activeBtn) {
        activeBtn.classList.remove("active");
    }
    target.classList.add("active");
}

function updateChart(data) {
    myChart.data.labels = data.labels;
    myChart.data.datasets[0].data = data.datasets[0].data;
    myChart.update();
}

function formatDate(date) {
    return new Date(date).toLocaleDateString("en-GB");
}

function generateDates(daysAgo) {
    const arr = [];
    for (let i = 0; i < daysAgo; i++) {
        const now = new Date();
        const date = now.setDate(now.getDate() - i);
        arr.push(formatDate(date));
    }
    return arr;
}
