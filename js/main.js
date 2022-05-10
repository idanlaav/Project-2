/// <reference path="jQuery.js" />


$(function () {

    var myInterval = null;

    var displayLoading = () => {
        $("#display").append(`<div id="loading"></div>`);
        $("#loader").addClass("#loader");
    }
    var hideLoading = () => {
        $(`#display`).empty();
    }

    var originalCoinsList = [];
    var displayedCoinsList = [];
    var graphPoints = []

    // Display resume on about - click
    $("#displayResume").on('click', function () {
        clearInterval(myInterval)
        $("#display").empty();
        $("#displayMyResume").empty();
        $("#chartContainer").empty();


        const myResume = `
        <div>
        <img src="./images/idan's resume.jpg" class="card-img-resume cardImg">
        </div>`
        $("#displayMyResume").append(myResume);
    });

    $("#display").on('click', '.switchAllCoins > input', function (evt) {
        const index = this.id
        const item = displayedCoinsList[+index]
        let selectedCoins = originalCoinsList.filter(item => item.checked)
        if (selectedCoins.length == 5 && !item.checked) {
            evt.preventDefault()
            let modal =
                `
                <button type="button" id="btnModal" style="display: none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                </button>
                <div class="modal fade" id="exampleModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">My selected coins</h5>
                        <button  type="button" class="btn-close cancelBtn" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                      <div style="height: 50px">
                      <span style="display: inline-block; min-width: 10%;">${selectedCoins[0].symbol}</span>
                      <label class="switch switchModal">
                      <input id="${0}"type="checkbox" checked>
                      <span class="slider round"></span>
                      </label>
                      </div>
                      <div style="height: 50px">
                      <span style="display: inline-block; min-width: 10%;">${selectedCoins[1].symbol}</span>
                      <label class="switch switchModal">
                      <input id="${1}"type="checkbox" checked>
                      <span class="slider round"></span>
                      </label>
                      </div>
                      <div style="height: 50px">
                      <span style="display: inline-block; min-width: 10%;">${selectedCoins[2].symbol}</span>
                      <label class="switch switchModal">
                      <input id="${2}"type="checkbox" checked>
                      <span class="slider round"></span>
                      </label>
                      </div>
                      <div style="height: 50px">
                      <span style="display: inline-block; min-width: 10%;">${selectedCoins[3].symbol}</span>
                      <label class="switch switchModal">
                      <input id="${3}"type="checkbox" checked>
                      <span class="slider round"></span>
                      </label>
                      </div>
                      <div style="height: 50px">
                      <span style="display: inline-block; min-width: 10%;">${selectedCoins[4].symbol}</span>
                      <label class="switch switchModal">
                      <input id="${4}"type="checkbox" checked>
                      <span class="slider round"></span>
                      </label>
                      </div>
                      </div>
                      <div class="modal-footer">
                        <button type="button" id="closeModal" class="btn btn-secondary cancelBtn" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary saveBtn" data-bs-dismiss="modal">Save changes</button>
                      </div>
                    </div>
                  </div>
                </div>`
            $("#display").append(modal);
            $("#btnModal").click();
            $("#display").on('click', '.switchModal > input', function () {
                const indexOfCoin = this.id
                const coin = selectedCoins[+indexOfCoin]
                coin.checked = !coin.checked;
            })
            $("#display").on('click', '.saveBtn', function (evt) {
                selectedCoins = originalCoinsList.filter(item => item.checked)
                if (selectedCoins.length != 5) {
                    item.checked = true
                }
                display100Coins(displayedCoinsList)
            })
            $("#display").on('click', '.cancelBtn', function (evt) {
                selectedCoins.forEach(item => item.checked = true)
                display100Coins(displayedCoinsList)
            })
        }
        else {
            item.checked = !item.checked

        }
    });

    // Display coins on start
    $("#displayButton").on('click', function () {
        display100Coins(originalCoinsList)
    });

    function display100Coins(list, i) {
        displayedCoinsList = list
        $("#displayMyResume").empty()
        $("#display").empty()
        clearInterval(myInterval)
        $("#chartContainer").empty();
        displayLoading();


        setTimeout(() => {
            hideLoading();



            for (let i = 0; i < list.length; i++) {
                let tr =
                    `
            <div id="showCoin">
            <div class="col">
            <div class="card" style="height: 325px; width: 300px; overflow: scroll;">
            <div id="myCardsCoin" class="card-body">
            <div>
            <label class="switch switchAllCoins">`
                if (list[i].checked) {
                    tr += `<input id="${i}" style="padding-left: 100px" type="checkbox" checked>`
                }
                else {
                    tr += `<input id="${i}" style="padding-left: 100px" type="checkbox">`
                }
                tr += `
            <span class="slider round"></span>
            </label>
            <div></div>
            <h5 class="card-text"> Symbol: ${list[i].symbol}</h5>
            <p class="card-text"> Name: ${list[i].name}</p>
            </div><br>
            <button id="moreInfo${[i]}" class="btn2 btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample${[i]}" aria-expanded="false" aria-controls="collapseExample">More info</button>
            <div class="collapse" id="collapseExample${[i]}">
            <div class="card2 card-body-2">
            <div>
            <div id="showValues${i}">
            <div>USD value: ${list[i].market_data.current_price.usd}$</div>
            <div>EUR value: ${list[i].market_data.current_price.eur}€</div>
            <div>ILS value: ${list[i].market_data.current_price.ils}₪</div>
            </div>
            <div class="responsive">
            <img src="${list[i].image.small}">
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            `
                $("#display").append(tr);
                updateDataToLocalStorage(i)
            }
        }, 500)

        function updateDataToLocalStorage(i) {
            $(`#moreInfo${i}`).click(()=> {
                try {
                    setInterval(() => {
                        $.ajax({
                            url: "https://api.coingecko.com/api/v3/coins",
                            success: newValueFromLocalStorage => {
                                localStorage.setItem("all coins", JSON.stringify(newValueFromLocalStorage));
                                for (let index = 0; index < newValueFromLocalStorage.length; index++) {
                                    $(`#showValues${index}`).empty()
                                    $(`#showValues${index}`).append(`
                                    <div>USD value: ${newValueFromLocalStorage[index].market_data.current_price.usd}$</div>
                                    <div>EUR value: ${newValueFromLocalStorage[index].market_data.current_price.eur}€</div>
                                    <div>ILS value: ${newValueFromLocalStorage[index].market_data.current_price.ils}₪</div>`)
                                }
        
                            },
                            error: err => alert("Error: " + err.status)
                        })
                    }, 1000*60*2)
                } catch (error) {
                    alert("Please try again.")
                }

            });
        }
    }

    // Display coins on home - click
    $("#displayButton").load("h", () => {
        $.ajax({
            url: "https://api.coingecko.com/api/v3/coins",
            success: list => {
                originalCoinsList = list
                display100Coins(list)
            },
            error: err => alert("Error: " + err.status)
        })
    });

    // Search coin by is name or symbol
    $("#myCoinSearch").on('click', function () {
        const value = $("input[type=search]").val();
        let result = originalCoinsList.filter(item => item.symbol.includes(value) || item.name.includes(value))
        display100Coins(result)

    });

    // Live reports
    $("#displayLiveReports").on('click', function () {
        $("#display").empty()
        $("#displayMyResume").empty()
        clearInterval(myInterval)
        $("#chartContainer").empty();

        displayLoading();

        var graph = {
            exportEnabled: true,
            animationEnabled: true,
            theme: "dark2",
            title: {
                text: "Coin Prices"
            },
            subtitles: [{
                text: ""
            }],
            axisX: {
                title: "Current time in seconds",
                valueFormatString: "DDD HH:mm:ss"
            },
            axisY: {
                title: "Coin Prices USD",
                titleFontColor: "#4F81BC",
                lineColor: "#4F81BC",
                labelFontColor: "#4F81BC",
                tickColor: "#4F81BC",
            },
            toolTip: {
                shared: true
            },
            legend: {
                cursor: "pointer",
                itemclick: toggleDataSeries,
                fontSize: 10,
                dockInsidePlotArea: true
            },
        }

        function toggleDataSeries(e) {
            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            } else {
                e.dataSeries.visible = true;
            }
            e.chart.render();
        }

        displayLive = originalCoinsList.filter(item => item.checked);
        let relevantCoins = displayLive.map(item => item.symbol).join(',')
        var myCoinsPrices = {}
        var savedCoins;

        myInterval = setInterval(() => {
            $.ajax({
                url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${relevantCoins}&tsyms=USD&api_key=afdf4a62572bbad7d189d96e891cd409817cf419353ddb23ede0ddd4d9e3fd71`,
                success: data => {
                    hideLoading()
                    displayMyCoinsValue(data)
                    saveCoinsToLocalStorage()
                    loadCoinsFromLocaleStorage()
                },
                error: err => alert("Error: " + err.status)
            })
        }, 2000)



        function saveCoinsToLocalStorage() {
            localStorage.setItem("My coins", JSON.stringify(relevantCoins));
        }

        function loadCoinsFromLocaleStorage() {
            relevantCoins = JSON.parse(localStorage.getItem('My coins'))
        }

        setTimeout(() => {
            localStorage.clear();
        }, 1000 * 60 * 2)

        function displayMyCoinsValue(data) {

            for (const [key, value] of Object.entries(data)) {
                if (myCoinsPrices[key.toLowerCase()]) {
                    myCoinsPrices[key.toLowerCase()].push({ x: new Date(), y: value["USD"] })
                }
                else {
                    myCoinsPrices[key.toLowerCase()] = [{ x: new Date(), y: value["USD"] }]
                }
            }


            var graphData = []
            displayLive.forEach(coin => {
                graphData.push(
                    {
                        type: "spline",
                        name: coin.name,
                        showInLegend: true,
                        yValueFormatString: `${coin.market_data.current_price.usd}`,
                        dataPoints: myCoinsPrices[coin.symbol]

                    })
            })
            graph.data = graphData

            $("#chartContainer").CanvasJSChart(graph)


        }
    });

})


















