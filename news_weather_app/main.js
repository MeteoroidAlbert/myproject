//處理不同頁面顯示
    
    const homeAnchor = document.getElementById("homeAnchor");
    const sportsAnchor = document.getElementById("sportsAnchor");
    const weatherAnchor = document.getElementById("weatherAnchor");
    const homePage = document.getElementById("homePage");
    const searchPage = document.getElementById("searchPage");
    const weatherPage = document.getElementById("weatherPage");
    

    //建立searchForm
    const searchForm = document.createElement("form");
    searchForm.classList.add("d-flex");
    searchForm.classList.add("flex-row");
    searchForm.innerHTML = `
    <input class="form-control me-2" type="search" id="searchInput" placeholder="Search" aria-label="Search">
    <button class="btn btn btn-success" type="submit" id="searchButton">Search</button>
    `;
    const navbarSupportedContent =  document.getElementById("navbarSupportedContent");
    const navbarOffcanvasMd = document.getElementById("navbarOffcanvasMd");


    //顯示首頁
    const showHomePage = () => {
        homePage.classList.remove("d-none");
        searchPage.classList.add("d-none");
        weatherPage.classList.add("d-none");
        searchForm.classList.add("widerSearchForm");
        homePage.appendChild(searchForm);
        document.getElementById("searchInput").value = "";
    }

    

    //顯示搜尋頁
    const showSearchPage = () => {
        homePage.classList.add("d-none");
        searchPage.classList.remove("d-none");
        weatherPage.classList.add("d-none");
        navbarSupportedContent.appendChild(searchForm);
        searchForm.classList.remove("widerSearchForm");
    }

    //顯示天氣頁
    const showWeatherPage = async() => {
        homePage.classList.add("d-none");
        searchPage.classList.add("d-none");
        weatherPage.classList.remove("d-none");
        navbarSupportedContent.appendChild(searchForm);
        searchForm.classList.remove("widerSearchForm");
        await fetchCityWeatherData(); 
        changeCardBackground();
        clearSvgContent();
        getTaiwanMap();
    }


    homeAnchor.addEventListener("click", () => {
        showHomePage();
    });

    sportsAnchor.addEventListener("click", () => {
        showSearchPage();
        currentPage = 1;
        currentInput = "sports";
        fetchNews(currentPage, currentInput);
    });

    weatherAnchor.addEventListener("click", () => {
        showWeatherPage();
    });


//新聞資訊獲取
    let currentInput = "";
    let currentPage = 1;
    const fetchNews = async (page, input) => {

        //處理獲取資訊日期範圍
        console.log(`Fetching news for ${input}, page number ${page}`);
        const msOfThreeDayAgo = Date.now() - 86400 * 1000 * 3;
        const date = new Date(msOfThreeDayAgo);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        navbarOffcanvasMd.classList.remove("show");

        //取得三天以內的資訊
        const url = `https://news-weather-app-4.onrender.com/news?q=${input}&page=${page}`
        
        const res = await fetch(url);
        const rawData = await res.json();


        let newsContent = "";
        rawData.articles.forEach(item => {
            newsContent += `
        <div class="card my-4 mx-2 newsCard" style="width: 18rem;">
            <img src="${item.urlToImage}" class="card-img-top pt-3" alt="...">
            <div class="card-body">
                <h5 class="card-title">${item.title}}</h5>
                <p class="card-text">${item.description}</p>
                <a href="${item.url}" target="_blank" class="btn btn-success">Read in detail</a>
            </div>        
        </div>
        `;
            document.getElementById("resultCount").innerHTML = rawData.totalResults;
            document.getElementById("keywords").innerHTML = currentInput;
            document.querySelector(".content").innerHTML = newsContent;
            document.getElementById("totalPages").innerHTML = `/ ${Math.ceil(rawData.totalResults / 20)}`;
            document.getElementById("pageInput").value = page;
        })

    }



    window.onload = function () {
        showHomePage();


        //當searchButton點擊時
        const searchingBtn = document.getElementById("searchButton");
        searchingBtn.addEventListener("click", e => {
            e.preventDefault();
            const userInput = document.getElementById("searchInput").value.toLowerCase();
            ///處理userInput
            if (!userInput) {
                alert("Please enter any keywords to search!");
            }
            else {
                showSearchPage();
                currentInput = userInput;
                currentPage = 1;
                fetchNews(currentPage, currentInput);
            }
        });


        //當prevPage被點擊時
        const prevPageBtn = document.getElementById("previousP");
        prevPageBtn.addEventListener("click", e => {
            if (currentPage >= 2) {
                e.preventDefault();
                currentPage -= 1;
                fetchNews(currentPage, currentInput);
            }
            else {
                alert("It's the first page!");
            }
        });
        //當nextPage被點擊時
        const nextPageBtn = document.getElementById("nextP");
        nextPageBtn.addEventListener("click", e => {
            e.preventDefault();
            currentPage += 1;
            if (currentPage <= 5) {
                fetchNews(currentPage, currentInput);
            }
            else {
                alert('Developer project are limited to a max of 100 results, so the maximum pages you can read is no more than "5" (20 results/page)! ');
            }
        });

        //當Go to page被點擊時
        const pageSearchBtn = document.getElementById("pageSearch");
        pageSearchBtn.addEventListener("click", e => {
            e.preventDefault();
            currentPage = document.getElementById("pageInput").value;
            
            if (document.getElementById("pageInput").value > 5) {
                alert('Developer project are limited to a max of 100 results, so the maximum pages you can read is no more than "5" (20 results/page)! ');
            }
            else if (document.getElementById("pageInput").value < 1) {
                alert('The page number lower than "1" is not available!');
            }
            else {
                fetchNews(currentPage, currentInput);
            }
        })
    }
//建立天氣資訊獲取
    //建立地區下拉式選單(以提取特定區域未來一周天氣)
    const citySourceID = [
        {name: "選擇一個縣市", id: "undefined"},
        {name: "宜蘭縣", id: "F-D0047-003" },
        {name: "基隆市", id: "F-D0047-051" },
        {name: "臺北市", id: "F-D0047-063" },
        {name: "新北市", id: "F-D0047-071" },
        {name: "桃園市", id: "F-D0047-007" },
        {name: "新竹市", id: "F-D0047-055" },
        {name: "新竹縣", id: "F-D0047-011" },
        {name: "苗栗縣", id: "F-D0047-015" },
        {name: "臺中市", id: "F-D0047-075" },
        {name: "彰化縣", id: "F-D0047-019" },
        {name: "南投縣", id: "F-D0047-023" },
        {name: "雲林縣", id: "F-D0047-027" },
        {name: "嘉義市", id: "F-D0047-059" },
        {name: "嘉義縣", id: "F-D0047-031" },
        {name: "臺南市", id: "F-D0047-079" },
        {name: "高雄市", id: "F-D0047-067" },
        {name: "屏東縣", id: "F-D0047-035" },
        {name: "花蓮縣", id: "F-D0047-043" },
        {name: "臺東縣", id: "F-D0047-039" },
        {name: "澎湖縣", id: "F-D0047-047" },
        {name: "連江縣", id: "F-D0047-083" },
        {name: "金門縣", id: "F-D0047-087" }
    ];

    //天氣描述與對應icon(分為白天與黑夜)
    const wxIcon = [
        {id: "01", icon: ["day-sunny", "night-clear"]},
        {id: "02", icon: ["day-sunny-overcast", "night-alt-partly-cloudy"]},
        {id: "03", icon: ["day-cloudy", "night-alt-cloudy"]},
        {id: "04", icon: ["cloudy", "cloudy"]},
        {id: "05", icon: ["cloudy", "cloudy"]},
        {id: "06", icon: ["cloudy", "cloudy"]},
        {id: "07", icon: ["cloudy", "cloudy"]},
        {id: "08", icon: ["day-showers", "night-showers"]},
        {id: "09", icon: ["showers","showers"]},
        {id: "10", icon: ["showers", "showers"]},
        {id: "11", icon: ["showers", "showers"]},
        {id: "12", icon: ["showers", "showers"]},
        {id: "13", icon: ["showers", "showers"]},
        {id: "14", icon: ["rain", "rain"]},
        {id: "15", icon: ["storm-showers", "storm-showers"]},
        {id: "16", icon: ["storm-showers", "storm-showers"]},
        {id: "17", icon: ["storm-showers", "storm-showers"]},
        {id: "18", icon: ["storm-showers", "storm-showers"]},
        {id: "19", icon: ["day-showers", "night-showers"]},
        {id: "20", icon: ["storm-showers", "storm-showers"]},
        {id: "21", icon: ["day-storm-showers", "night-alt-storm-showers"]},
        {id: "22", icon: ["storm-showers", "storm-showers"]},
        {id: "23", icon: ["rain-mix", "rain-mix"]},
        {id: "24", icon: ["day-fog", "night-fog"]},
        {id: "25", icon: ["fog", "fog"]},
        {id: "26", icon: ["day-fog", "night-fog"]},
        {id: "27", icon: ["fog", "fog"]},
        {id: "28", icon: ["fog", "fog"]},
        {id: "29", icon: ["showers", "showers"]},
        {id: "30", icon: ["showers", "showers"]},
        {id: "31", icon: ["fog", "fog"]},
        {id: "32", icon: ["fog", "fog"]},
        {id: "33", icon: ["storm-showers", "storm-showers"]},
        {id: "34", icon: ["storm-showers", "storm-showers"]},
        {id: "35", icon: ["storm-showers", "storm-showers"]},
        {id: "36", icon: ["storm-showers", "storm-showers"]},
        {id: "37", icon: ["fog", "fog"]},
        {id: "38", icon: ["fog", "fog"]},
        {id: "39", icon: ["fog", "fog"]},
        {id: "41", icon: ["storm-showers", "storm-showers"]},
        {id: "42", icon: ["snow", "snow"]}
    ]


    //取得縣市選項
    const cityDropdown = document.getElementById("cityDropdown");
    const townshipDropdown = document.getElementById("townshipDropdown");
    citySourceID.forEach((item) => {
        cityDropdown.innerHTML += `<option value=${item.name}>${item.name}</option>`;
    });
    let selectedCity = "";
    let selectedTownship = "";



    //建立取得特定縣市下特地鄉鎮選項函式
    let townshipData = "";


    const getTownship = async (index) => {
        townshipDropdown.innerHTML = "";
        if (index === 0) {
            return;
        }
        else {
            const cityID = citySourceID[index].id;
            const res = await fetch(`https://news-weather-app-4.onrender.com/townships?cityID=${cityID}`);
            townshipData = await res.json();
            townshipData.records.locations[0].location.forEach((item) => {
                townshipDropdown.innerHTML += `<option value="${item.locationName}">${item.locationName}</option>`;
            });
            updateTownshipWeatherInfo();
        }
    };


    //取得天氣卡片中月日週資訊

    const getMyTime = (input) => {
        const timeStamp = Date.now() + 86400 * 1000 * input;
        const myDate = new Date(timeStamp);
        const myMonth = myDate.getMonth() + 1;
        const myDay = myDate.getDate();
        const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        const myWeekDay = weekdays[myDate.getDay()];
        const myTime = `
        <div class="d-flex flex-column align-items-start mx-2 my-2">
            <h4>${myWeekDay}</h4>
            <span>${myMonth}月${myDay}日</span>
        </div>
        `;
        return myTime;
    };



    //建立根據選定縣市更新縣市級天氣資訊函式
    let cityData = "";
    let cityMinTAndMaxT = [];
    let isMorningForecastToday = true;
    const fetchCityWeatherData = async() => {
        const res = await fetch(`https://news-weather-app-4.onrender.com/city-weather`);
        cityData = await res.json();
        const morning = /18:00:00/;
        isMorningForecastToday = morning.test(cityData.records.locations[0].location[0].weatherElement[0].time[0].endTime);
        
        cityMinTAndMaxT = [];
        cityData.records.locations[0].location.forEach(item => {
            const tempData = {
                name: item.locationName,
                minT: item.weatherElement[8].time[0].elementValue[0].value,
                maxT: item.weatherElement[12].time[0].elementValue[0].value,
                wxID: item.weatherElement[6].time[0].elementValue[1].value
            }
        
            cityMinTAndMaxT.push(tempData);
        });
    }





    const updateCityWeatherInfo = async() => {
        await fetchCityWeatherData();
        const cityIndex = cityData.records.locations[0].location.findIndex(item => item.locationName === selectedCity);
        const searchWeatherElement = (weatherElementInput, elementValueIndex) => cityData.records.locations[0].location[cityIndex].weatherElement.find(item => item.elementName === weatherElementInput).time[0].elementValue[elementValueIndex].value;
        const searchWxId = cityData.records.locations[0].location[cityIndex].weatherElement.find(item => item.elementName === "Wx").time[0].elementValue[1].value;
        
        

        const weatherCardInfo = document.getElementById("weatherCardInfo");
        weatherCardInfo.classList.remove("d-none");
        const locationName = document.getElementById("locationName");
        const weatherDescription = document.getElementById("weatherDescription");
        const avgTemp = document.getElementById("avgTemp");
        const wxIconPosition = document.getElementById("wxIconPosition");
        const rainProbability = document.getElementById("rainProbability");
        const minToMaxTemp = document.getElementById("minToMaxTemp");
        const WS = document.getElementById("WS");
        const WD = document.getElementById("WD");
        const RH = document.getElementById("RH");
        const maxAT = document.getElementById("maxAT");
        const UVI = document.getElementById("UVI");
        const maxCI = document.getElementById("maxCI")
        const predict = document.getElementById("predict");
        

        
        const wxCode = isMorningForecastToday ? wxIcon.find(item => item.id === searchWxId).icon[0] : wxIcon.find(item => item.id === searchWxId).icon[1];
        

        locationName.innerHTML = selectedCity;
        avgTemp.innerHTML = ` ${searchWeatherElement("T", 0)}&degC `;
        wxIconPosition.innerHTML = `<i class="wi wi-${wxCode}" id="wxIcon"></i>`;
        weatherDescription.innerHTML = searchWeatherElement("Wx", 0);
        rainProbability.innerHTML = ` ${searchWeatherElement("PoP12h", 0)}%`;
        minToMaxTemp.innerHTML = ` ${searchWeatherElement("MinT", 0)}&degC ~ ${searchWeatherElement("MaxT", 0)}&degC`;
        WS.innerHTML = `${searchWeatherElement("WS", 0)} 公尺/秒`
        WD.innerHTML = `${searchWeatherElement("WD", 0)}`;
        RH.innerHTML = `${searchWeatherElement("RH", 0)}%`;
        maxAT.innerHTML = ` ${searchWeatherElement("MaxAT", 0)}&degC`;
        UVI.innerHTML = `${searchWeatherElement("UVI", 0)} (${searchWeatherElement("UVI", 1)})`
        maxCI.innerHTML = `${searchWeatherElement("MaxCI", 1)}`
        predict.innerHTML = `${isMorningForecastToday ? `今日白天 (6:00 AM ~ 18:00 PM)` : `今晚至凌晨 (18:00 PM ~ 6: 00 AM)`}`;

        
        changeCardBackground();
    }


    //根據早晚改變天氣資訊卡片的背景、文字顏色
    const changeCardBackground = () => {
        const weatherCard = document.getElementById("weatherCard");
        const weatherCardPart = document.querySelectorAll(".weatherCardPart");
        const mainContent = document.getElementById("weatherPage");
        
        weatherCardPart.forEach(element => element.style.color = isMorningForecastToday
            ? "#000000" 
            : "#FFFFFF");
        weatherCardPart.forEach(element => element.style.background = "rgba(240, 255, 255, 0.2)")
        mainContent.style.background = isMorningForecastToday 
            ? "linear-gradient(180deg, #C4E1FF 5%, #ACD6FF 15%, #97CBFF 30%, #84C1FF 100%)" 
            : "linear-gradient(180deg, #005AB5 5%, #004B97 15%, #003D79 30%, #000242 100%)"; 
    }



    //建立根據所選縣市獲取其鄉鎮下拉選單選項，並獲取該鄉鎮選項中第一項目的當地天氣資訊
    const updateDropdwonList = async () => {
        selectedCity = cityDropdown.value;
        const cityIndex = citySourceID.findIndex(item => item.name == selectedCity);
        
        await getTownship(cityIndex);   
        updateCityWeatherInfo();
    }

    //建立根據特定鄉鎮獲取、更新鄉鎮級天氣資訊函式
    const updateTownshipWeatherInfo = () => {


        selectedTownship = townshipDropdown.value;
        const townshipIndex = townshipData.records.locations[0].location.findIndex( item => item.locationName === selectedTownship);


        const targetTownshipName = townshipData.records.locations[0].location[townshipIndex].locationName;
        const searchWeatherElement = (weatherElementInput) => townshipData.records.locations[0].location[townshipIndex].weatherElement.find(item => item.elementName === weatherElementInput);
        const targetTownshipAvgTemp = (index) => searchWeatherElement("T").time[index].elementValue[0].value;
        const targetTownshipPoP12h = (index) => searchWeatherElement("PoP12h").time[index].elementValue[0].value;
        const targetTownshipWx = (index) => searchWeatherElement("Wx").time[index].elementValue[0].value;
        const targetTownshipMaxT = (index) => searchWeatherElement("MaxT").time[index].elementValue[0].value;
        const targetTownshipMinT = (index) => searchWeatherElement("MinT").time[index].elementValue[0].value;
        const targetTownshipMaxAT = (index) => searchWeatherElement("MaxAT").time[index].elementValue[0].value;

        
        const isNightForecastToday = !isMorningForecastToday;

        const townshipWeatherCard = `
        <div class="container">
            <h2 class="ms-3 mt-3">${targetTownshipName}</h2>
            <div class="row justify-content-center" id="threeDaysForecast">
                <div class="col threeDaysForeCast" >
                    ${getMyTime(0)}
                    <div class="card mb-3 mx-2 weatherCardPart" style="width: 95%;">
                        <div class="card-body d-flex flex-row justify-content-between">
                            <div class="d-flex flex-column justify-content-start">
                                <h4 class="card-title">${isMorningForecastToday ? "白天" : "夜晚"}</h4>
                                <p class="card-text">${targetTownshipWx(0)}</p>   
                            </div>
                            <div><h3>${targetTownshipAvgTemp(0)}&degC</h3></div>
                        </div>
                        <div class="ms-3">
                            <i class="fa fa-droplet" id="PoP"></i><p class="d-inline"> ${targetTownshipPoP12h(0)}%</p><br>
                            <i class="fa-solid fa-temperature-quarter"></i><p class="d-inline">${targetTownshipMinT(0)}~${targetTownshipMaxT(0)}&degC</p>
                            <p>最高體感溫度: ${targetTownshipMaxAT(0)}&degC</p>
                        </div>
                    </div>
                    ${isMorningForecastToday ? `
                    <div class="card mb-3 mx-2 weatherCardPart" style="width: 95%;">
                        <div class="card-body d-flex flex-row" justify-content-between> 
                            <div class="d-flex flex-column justify-content-start">
                                <h4 class="card-title">夜晚</h4>
                                <p class="card-text">${targetTownshipWx(1)}</p>   
                            </div>
                            <div><h3>${targetTownshipAvgTemp(1)}&degC</h3></div>
                        </div>
                        <div class="ms-3">
                            <i class="fa fa-droplet" id="PoP"></i><p class="d-inline"> ${targetTownshipPoP12h(1)}%</p><br>
                            <i class="fa-solid fa-temperature-quarter"></i><p class="d-inline">${targetTownshipMinT(1)}~${targetTownshipMaxT(1)}&degC</p>
                            <p>最高體感溫度: ${targetTownshipMaxAT(1)}&degC</p>
                        </div>
                    </div>
                    ` : ``}   
                </div>
                <div class="col threeDaysForeCast" >
                    ${getMyTime(1)}
                    <div class="card mb-3 mx-2 weatherCardPart" style="width: 95%;">
                        <div class="card-body d-flex flex-row justify-content-between" >
                            <div class="d-flex flex-column justify-content-start">
                                <h4 class="card-title">白天</h4>
                                <p class="card-text">${isNightForecastToday ? targetTownshipWx(1) : targetTownshipWx(2)}</p>   
                            </div>
                            <div><h3>${isNightForecastToday ? targetTownshipAvgTemp(1) : targetTownshipAvgTemp(2)}&degC</h3></div>
                        </div>
                        <div class="ms-3">
                            <i class="fa fa-droplet" id="PoP"></i><p class="d-inline"> ${isNightForecastToday ? targetTownshipPoP12h(1) : targetTownshipPoP12h(2)}%</p><br>
                            <i class="fa-solid fa-temperature-quarter"></i><p class="d-inline">${isNightForecastToday ? targetTownshipMinT(1) : targetTownshipMinT(2)}~${isNightForecastToday ? targetTownshipMaxT(1) : targetTownshipMaxT(2)}&degC</p>
                            <p>最高體感溫度: ${isNightForecastToday ? targetTownshipMaxAT(1) : targetTownshipMaxAT(2)}&degC</p>
                        </div>
                    </div>
                    <div class="card mb-3 mx-2 weatherCardPart" style="width: 95%;">
                        <div class="card-body d-flex flex-row justify-content-between" >
                            <div class="d-flex flex-column justify-content-start">
                                <h4 class="card-title">夜晚</h4>
                                <p class="card-text">${isNightForecastToday ? targetTownshipWx(2) : targetTownshipWx(3)}</p>   
                            </div>
                            <div><h3>${isNightForecastToday ? targetTownshipAvgTemp(2) : targetTownshipAvgTemp(3)}&degC</h3></div>
                        </div>
                        <div class="ms-3">
                            <i class="fa fa-droplet" id="PoP"></i><p class="d-inline"> ${isNightForecastToday ? targetTownshipPoP12h(2) : targetTownshipPoP12h(3)}%</p><br>
                            <i class="fa-solid fa-temperature-quarter"></i><p class="d-inline">${isNightForecastToday ? targetTownshipMinT(2) : targetTownshipMinT(3)}~${isNightForecastToday ? targetTownshipMaxT(2) : targetTownshipMaxT(3)}&degC</p>
                            <p>最高體感溫度: ${isNightForecastToday ? targetTownshipMaxAT(2) : targetTownshipMaxAT(3)}&degC</p>
                        </div>
                    </div>
                </div>
                <div class="col threeDaysForeCast" >
                    ${getMyTime(2)}
                    <div class="card mb-3 mx-2 weatherCardPart" style="width: 95%;">
                        <div class="card-body d-flex flex-row justify-content-between">
                            <div class="d-flex flex-column justify-content-start">
                                <h4 class="card-title">白天</h4>
                                <p class="card-text">${isNightForecastToday ? targetTownshipWx(3) : targetTownshipWx(4)}</p>   
                            </div>
                            <div><h3>${isNightForecastToday ? targetTownshipAvgTemp(3) : targetTownshipAvgTemp(4)}&degC</h3></div>
                        </div>
                        <div class="ms-3">
                            <i class="fa fa-droplet" id="PoP"></i><p class="d-inline"> ${isNightForecastToday ? targetTownshipPoP12h(3) : targetTownshipPoP12h(4)}%</p><br>
                            <i class="fa-solid fa-temperature-quarter"></i><p class="d-inline">${isNightForecastToday ? targetTownshipMinT(3) : targetTownshipMinT(4)}~${isNightForecastToday ? targetTownshipMaxT(3) : targetTownshipMaxT(4)}&degC</p>
                            <p>最高體感溫度: ${isNightForecastToday ? targetTownshipMaxAT(3) : targetTownshipMaxAT(4)}&degC</p>
                        </div>
                    </div>
                    <div class="card mb-3 mx-2 weatherCardPart" style="width: 95%;">
                        <div class="card-body d-flex flex-row justify-content-between">
                            <div class="d-flex flex-column justify-content-start">
                                <h4 class="card-title">夜晚</h4>
                                <p class="card-text">${isNightForecastToday ? targetTownshipWx(4) : targetTownshipWx(5)}</p>   
                            </div>
                            <div><h3>${isNightForecastToday ? targetTownshipAvgTemp(4) : targetTownshipAvgTemp(5)}&degC</h3></div>
                        </div>
                        <div class="ms-3">
                            <i class="fa fa-droplet" id="PoP"></i><p class="d-inline"> ${isNightForecastToday ? targetTownshipPoP12h(4) : targetTownshipPoP12h(5)}%</p><br>
                            <i class="fa-solid fa-temperature-quarter"></i><p class="d-inline">${isNightForecastToday ? targetTownshipMinT(4) : targetTownshipMinT(5)}~${isNightForecastToday ? targetTownshipMaxT(4) : targetTownshipMaxT(5)}&degC</p>
                            <p>最高體感溫度: ${isNightForecastToday ? targetTownshipMaxAT(4) : targetTownshipMaxAT(5)}&degC</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

        const local = document.getElementById("local");
        local.innerHTML = "";
        local.innerHTML += townshipWeatherCard;

        changeCardBackground();
    }




//建立處台灣地圖資訊獲取

    const getTaiwanMap = async () => {
        //使SVG圖像的寬、高等於其所在的<div>
        const taiwanMapFrame = document.getElementById("map");
        const width = taiwanMapFrame.offsetWidth;
        const height = taiwanMapFrame.offsetHeight;

        //調整地圖放大倍率
        let mercatorScale;
        let mercatorScaleLJ;
        
        let w = window.innerWidth;

        if (w > 1366) {
            mercatorScale = 10000;
            mercatorScaleLJ = 25000;
        
        } else if (w <= 1366 && w > 480) {
            mercatorScale = 7800;
            mercatorScaleLJ = 20000;
        } else {
            mercatorScale = null;
            mercatorScaleLJ = null;
        }
        

        //使用d3.js開始進行地理資訊可視化
        const allProjection = d3.geoMercator()
            .center([121, 24])
            .scale(mercatorScale)
            .translate([width / 1.75, height / 2]);
        const path = await d3.geoPath().projection(allProjection);


        const LJProjection = d3.geoMercator()
            .center([119.9500, 26.2000])
            .scale(mercatorScaleLJ)
            .translate([width * 0.25 / 2, height * 0.25 / 2]);

        const LJPath = await d3.geoPath().projection(LJProjection);

        const KMProjection = d3.geoMercator()
            .center([118.3225, 24.4303])
            .scale(mercatorScale)
            .translate([width * 0.25 / 2, height * 0.25 / 2]);
        
        const KMPath = await d3.geoPath().projection(KMProjection);


        //使用d3 selector繪製svg畫布
        const svgMain = await d3.select("#svgMain")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("fill", "#808000");

        const svgLJ = await d3.select("#svgLJ")
            .attr("width", width * 0.25)
            .attr("height", width * 0.25)
            .attr("viewBox", `0 0 ${width * 0.25} ${width * 0.25}`)
            .attr("fill", "#808000");
        
        const svgKM = await d3.select("#svgKM")
            .attr("width", width * 0.25)
            .attr("height", width * 0.25)
            .attr("viewBox", `0 0 ${width * 0.25} ${width * 0.25}`)
            .attr("fill", "#808000");


        //寫入GeoJSON檔案
        const url = "taiwan_map.json";
        await d3.json(url).then(geometry => {
            const mainFeatures = geometry.features.filter(d => d.properties.name !== "連江縣" && d.properties.name !== "金門縣")
            const LJFeatures = geometry.features.filter(d => d.properties.name === "連江縣")
            const KMFeatures = geometry.features.filter(d => d.properties.name === "金門縣")
            
            const mapGenerator = (svgInput, dataInput, pathGenerator) => {
                svgInput.selectAll("path")                                          //選擇所有<svg>中的<path/>，形成一個選擇集，但目前HTML中並沒有任何<path/>存在
                .data(dataInput)                                                    //將引入的數據與現存<path/>綁定，但由於目前沒有任何<path/>存在，因此所有數據尚待分配
                .enter().append("path")                                             //使用enter()，可以進入選擇集，此時發現選擇集是空的!，因此使用append()，加入<path/>，此時每筆數據會對應產生一個<path/>
                .attr("d", pathGenerator)                                           //對每個<path/>新增d attribute，並以先前宣稱的path變數作為繪製路徑     
                .attr("id", d => d.properties.id)                                   //對每個<path/>新增id attribute，用每一組與<path/>對應的data(此處便是指d，此d並不是path元素的d屬性!!)中的properties.name，形成獨有的id
                .attr("stroke", "white")
                .attr("stroke-width", 0.1)
                .on('click', async function (event, d) {
                    // 更新 HTML
                    
                    cityDropdown.value = d.properties.name;
                    updateDropdwonList();
                    updateRegionColor(this);

                })
                .on("mouseover", function (event, d) {
                    if (d.properties.name !== selectedCity) {
                        d3.select(this).attr("fill", "#ffd700")
                    }
                })
                .on("mouseout", function (event, d) {
                    if (d.properties.name !== selectedCity) {
                        d3.select(this).attr("fill", "#808000")
                    }
                })
            
            }
            
            mapGenerator(svgMain, mainFeatures, path);
            mapGenerator(svgLJ, LJFeatures, LJPath);
            mapGenerator(svgKM, KMFeatures, KMPath);

            //處理點擊特定縣市時將該地區標色
            const updateRegionColor = (element) => {
                svgMain.selectAll("path")
                    .attr("fill", "#808000");
                svgLJ.selectAll("path")
                    .attr("fill", "#808000");

                d3.select(element)
                    .attr("fill", "#ffa500");
            }

            //建立每個縣市地區的地理中心資訊array
            let cityCenterData = [];
            const findCenterData = (svgInput, dataInput, pathInput) => {
                svgInput.selectAll("path")
                .data(dataInput)
                .each(d => {
                    const center = pathInput.centroid(d);

                    const cityCenter = {
                        name: d.properties.name,
                        x: center[0],
                        y: center[1]
                    }
                    cityCenterData.push(cityCenter);
                }); 
            }
            findCenterData(svgMain, mainFeatures, path);
            findCenterData(svgLJ, LJFeatures, LJPath);
            findCenterData(svgKM, KMFeatures, KMPath)
            //console.log(cityCenterData);
            

            //建立地圖上縣市天氣資訊方塊
            const cityWeatherBlock = (svgInput, cityInput, calX, calY) => {
                const wxCode = isMorningForecastToday ? 
                    wxIcon.find(item => item.id === cityMinTAndMaxT.find(item => item.name === cityInput).wxID).icon[0] : 
                    wxIcon.find(item => item.id === cityMinTAndMaxT.find(item => item.name === cityInput).wxID).icon[1];
                svgInput.append("foreignObject")
                .attr("x", cityCenterData.find(item => item.name === cityInput).x + calX)
                .attr("y", cityCenterData.find(item => item.name === cityInput).y + calY)
                .attr("width", 80) 
                .attr("height", 50)
                .append("xhtml:div")
                    .attr("class", "cityWeatherBlock")
                    .style("background-color", "rgba(255, 250, 240, 0.7)")
                    .style("border", "1px solid gray")
                    .style("font-size", "0.8rem")
                    .style("text-align", "center")
                    .html(`${cityInput} <i class="wi wi-${wxCode} cityWeatherBlockWxIcon"></i><br>${cityMinTAndMaxT.find(item => item.name === cityInput).minT}\u00B0C ~ ${cityMinTAndMaxT.find(item => item.name === cityInput).maxT}\u00B0C`)
                    .on("click", () => {
                        cityDropdown.value = cityInput;
                        updateDropdwonList();
                        document.querySelectorAll("path").forEach(item => item.setAttribute("fill", "#808000"));
                        document.getElementById(cityDropdown.value).setAttribute("fill", "#ffa500");
                    })
                    .on("mouseover", function (event, d) {
                        if  (cityInput !== cityDropdown.value) {
                            const pathRegion = document.getElementById(cityInput);
                            d3.select(pathRegion).attr("fill", "#ffd700");
                        }
                    })
                    .on("mouseout", function (event, d) {
                        if (cityInput !== cityDropdown.value) {
                            const pathRegion = document.getElementById(cityInput);
                            d3.select(pathRegion).attr("fill", "#808000");
                        }
                    })
            }
            

            const cityWeatherBlockPositionData = [
                { name: "宜蘭縣", calX: +10, calY: 0 },
                { name: "基隆市", calX: 0, calY: -50 },
                { name: "新北市", calX: +35, calY: -20 },
                { name: "臺北市", calX: -70, calY: -60 },
                { name: "桃園市", calX: -105, calY: -73 },
                { name: "新竹縣", calX: 0, calY: -5 },
                { name: "新竹市", calX: -90, calY: -45 },
                { name: "苗栗縣", calX: -100, calY: -50 },
                { name: "臺中市", calX: -140, calY: -40 },
                { name: "彰化縣", calX: -100, calY: -40 },
                { name: "南投縣", calX: -20, calY: -20 },
                { name: "雲林縣", calX: -100, calY: -30 },
                { name: "嘉義縣", calX: -140, calY: -10 },
                { name: "嘉義市", calX: 10, calY: -20 },
                { name: "臺南市", calX: -90, calY: 0 },
                { name: "高雄市", calX: -125, calY: +25 },
                { name: "屏東縣", calX: -100, calY: 0 },
                { name: "花蓮縣", calX: +25, calY: 0 },
                { name: "臺東縣", calX: +15, calY: -10 },
                { name: "澎湖縣", calX: -100, calY: 0 },
                { name: "金門縣", calX: -10, calY: 0 },
                { name: "連江縣", calX: -10, calY: 0 }
            ];

            cityWeatherBlockPositionData.forEach(item => {
                if (item.name === "連江縣") {
                    cityWeatherBlock(svgLJ, item.name, item.calX, item.calY)
                }
                else if (item.name === "金門縣"){
                    cityWeatherBlock(svgKM, item.name, item.calX, item.calY)
                }
                else {
                    cityWeatherBlock(svgMain, item.name, item.calX, item.calY)
                }
            })
            

        }).catch(error => {
            console.error('Error loading the GeoJSON file:', error)
        })

    }



//建立監聽處理各種資訊改變時，調用各種函式

    //建立清除原svg內容的函式
    const clearSvgContent = () => {
        d3.select("#svgMain").selectAll("*").remove();
        d3.select("#svgLJ").selectAll("*").remove();
    };
    
    
    
    //當頁面大小重新定義時，清除原來svg內容，再重新呼叫getTaiwanMap，以確保更新width、height變數被正確使用於新的視窗大小之下
    
    window.addEventListener('resize', async() => {
        await fetchCityWeatherData();
        clearSvgContent();
        getTaiwanMap();
        
    });


    //建立監聽事件用於當特定縣市或特定區域被選擇或改變時
    cityDropdown.addEventListener("change", async() => {

        updateDropdwonList();
        //變更<svg>畫布內容，將特定縣市標上顏色
        document.querySelectorAll("path").forEach(item => item.setAttribute("fill", "#808000"));
        document.getElementById(cityDropdown.value).setAttribute("fill", "#ffa500");
    });


    townshipDropdown.addEventListener("change", () => {
        updateTownshipWeatherInfo();
    });



