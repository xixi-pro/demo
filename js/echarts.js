$(function () {
    console.log(echarts.version);

    var chart1 = echarts_2();
    var chart2 = echarts_4();

    chart1.group = 'group1';
    chart2.group = 'group1';

    echarts.connect('group1');

    echarts_1();
    echarts_2();
    echarts_4();
    echarts_5();
    echarts_6();
    echarts_7();
})


function echarts_1() {
    var myChart = echarts.init($("#echart_1")[0]);

    Papa.parse("../车质网汽车投诉排名.csv", {
        download: true,
        complete: function (results) {
            var data = results.data;


            var brandCounts = {};
            for (var i = 1; i < data.length; i++) {
                var brand = data[i][1]; // 
                var count = parseInt(data[i][6]);

                if (brand in brandCounts) {
                    brandCounts[brand] += count;
                } else {
                    brandCounts[brand] = count;
                }
            }


            var sortedBrands = Object.keys(brandCounts).sort(function (a, b) {
                return brandCounts[b] - brandCounts[a];
            }).slice(0, 5);
            var seriesData = sortedBrands.map(function (brand) {
                return {
                    name: brand,
                    value: brandCounts[brand]
                };
            });


            var option = {
                grid: {
                    top: "15%",
                    left: "13%",
                    right: "2%",
                    bottom: "15%"
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'shadow' },
                    formatter: function (params) {
                        var tar = params[0];
                        return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
                    }
                },
                xAxis: [{
                    type: 'category',
                    data: sortedBrands,
                    axisLabel: { show: true, textStyle: { color: '#fff', fontSize: 12 } },
                    axisLine: { // x 轴刻度线样式
                        lineStyle: {
                            color: '#ddd', // 刻度线颜色
                            width: 2,      // 刻度线宽度
                            opacity: 0.7   // 刻度线透明度
                        }
                    }
                }],
                yAxis: [{
                    type: 'value',
                    splitLine: { show: false },
                    axisLabel: { show: true, textStyle: { color: '#fff' } },
                    axisLine: { // y 轴刻度线样式
                        lineStyle: {
                            color: '#ddd', // 刻度线颜色
                            width: 2,      // 刻度线宽度
                            opacity: 0.6   // 刻度线透明度
                        }
                    }
                }],
                series: [{
                    name: '投诉数量',
                    type: 'bar',
                    stack: '次数',
                    itemStyle: { normal: { label: { show: true, position: 'inside' }, color: '#44aff0' } },
                    data: seriesData
                }]
            };

            // 5. 设置图表的配置项并渲染图表
            myChart.setOption(option);


            window.addEventListener('resize', function () { myChart.resize(); });
        }
    });
}







function echarts_2() {
    var myChart = echarts.init(document.getElementById('echarts_2'));

    Papa.parse("../车质网汽车投诉.csv", {
        download: true,
        complete: function (results) {
            var data = results.data;

            var problemCounts = {};
            for (var i = 1; i < data.length; i++) {
                var problem = data[i][5];
                if (problem in problemCounts) {
                    problemCounts[problem]++;
                } else {
                    problemCounts[problem] = 1;
                }
            }

            var sortedProblems = Object.keys(problemCounts).sort(function (a, b) {
                return problemCounts[b] - problemCounts[a];
            }).slice(0, 4);

            var pieData = sortedProblems.map(function (problem) {
                return { value: problemCounts[problem], name: problem };
            });

            var otherSum = Object.keys(problemCounts).filter(problem => !sortedProblems.includes(problem)).reduce((sum, problem) => sum + problemCounts[problem], 0);
            pieData.push({ value: otherSum, name: '其他' });

            var option = {
                backgroundColor: 'rgba(0,0,0,0)',
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}: <br/>{c} ({d}%)"
                },
                color: ['#af89d6', '#4ac7f5', '#0089ff', '#f36f8a', '#f5c847'],
                legend: {
                    x: '70%',
                    y: 'center',
                    orient: 'vertical',
                    itemGap: 12,
                    itemWidth: 10,
                    itemHeight: 10,
                    icon: 'rect',
                    data: pieData.map(item => item.name),
                    textStyle: {
                        color: [],
                        fontStyle: 'normal',
                        fontFamily: '微软雅黑',
                        fontSize: 14,
                    }
                },
                grid: {
                    top: "30%"
                },
                series: [{
                    name: '问题类型占比',
                    type: 'pie',
                    clockwise: false,
                    minAngle: 20,
                    center: ['35%', '50%'],
                    radius: [50, 80],
                    avoidLabelOverlap: true,
                    itemStyle: {
                        normal: {
                            borderColor: '#1e2239',
                            borderWidth: 2,
                        },
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'inside',
                            formatter: "{d}%",
                            textStyle: {
                                color: '#fff',
                            }
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontWeight: 'bold'
                            }
                        }
                    },
                    data: pieData
                }]
            };

            myChart.setOption(option);
            window.addEventListener("resize", function () {
                myChart.resize();
            });
        }
    });
    return myChart;
}

function echarts_4() {
    var myChart = echarts.init(document.getElementById('echarts_4'));

    Papa.parse("../车质网汽车投诉.csv", {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: function (results) {
            var data = results.data;

            var problemCounts = {};
            var totalComplaints = {}; // 记录每月的总投诉量

            data.forEach(row => {
                var problemType = row['problem'];
                if (problemCounts[problemType]) {
                    problemCounts[problemType]++;
                } else {
                    problemCounts[problemType] = 1;
                }

                var dateStr = row['datetime'];
                var date = new Date(dateStr);
                if (!isNaN(date.getTime())) {
                    var month = date.getMonth() + 1;
                    if (month >= 6 && month <= 12) {
                        if (!totalComplaints[`${month}月`]) {
                            totalComplaints[`${month}月`] = 0;
                        }
                        totalComplaints[`${month}月`]++; // 计算每月的总投诉量
                    }
                }
            });

            var sortedProblems = Object.keys(problemCounts).sort((a, b) => problemCounts[b] - problemCounts[a]);

            var categories = sortedProblems.slice(0, 4);
            var otherCount = sortedProblems.slice(4).reduce((sum, problem) => sum + problemCounts[problem], 0);
            if (otherCount > 0) {
                categories.push('其他');
            }

            var monthlyComplaintCounts = {
                '6月': {},
                '7月': {},
                '8月': {},
                '9月': {},
                '10月': {},
                '11月': {},
                '12月': {}
            };

            Object.keys(monthlyComplaintCounts).forEach(month => {
                categories.forEach(category => {
                    monthlyComplaintCounts[month][category] = 0;
                });
            });

            data.forEach(row => {
                var dateStr = row['datetime'];
                var date = new Date(dateStr);
                if (!isNaN(date.getTime())) {
                    var month = date.getMonth() + 1;
                    if (month >= 6 && month <= 12) {
                        var problemType = row['problem'];
                        if (categories.includes(problemType)) {
                            monthlyComplaintCounts[`${month}月`][problemType]++;
                        } else {
                            monthlyComplaintCounts[`${month}月`]['其他']++;
                        }
                    }
                }
            });

            var colorList = ['#af89d6', '#4ac7f5', '#0089ff', '#f36f8a', '#f5c847'];
            var months = Object.keys(monthlyComplaintCounts);
            var barSeriesData = categories.map(function (category, index) {
                return {
                    name: category,
                    type: 'bar', // 使用柱状图展示投诉量
                    stack: '总量',
                    itemStyle: {
                        color: colorList[index % colorList.length]
                    },
                    data: months.map(function (month) {
                        return monthlyComplaintCounts[month][category];
                    })
                };
            });

            var lineSeriesData = [{
                name: '增长率',
                type: 'line', // 使用折线图展示总投诉量的增长率
                symbol: 'circle', // 折线图上的标记点形状
                symbolSize: 8, // 折线图上的标记点大小
                yAxisIndex: 1,
                itemStyle: {
                    color: 'rgba(255,255,255,1)'
                },
                data: months.map(function (month, index) {
                    var currentMonthTotal = totalComplaints[month] || 0;
                    var previousMonthTotal = index > 0 ? totalComplaints[months[index - 1]] || 0 : 0;
                    var growthRate = previousMonthTotal !== 0 ? ((currentMonthTotal - previousMonthTotal) / previousMonthTotal * 100).toFixed(2) : 0; // 计算增长率
                    return parseFloat(growthRate);
                })
            }];

            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    },
                    formatter: function (params) {
                        var tooltip = params[0].axisValueLabel + '<br />';
                        params.forEach(function (item) {
                            tooltip += item.seriesName + ': ' + (item.seriesType === 'line' ? item.value.toFixed(2) + '%' : item.value) + '<br />';
                        });
                        return tooltip;
                    }
                },
                legend: {
                    data: categories.concat(['增长率']),
                    textStyle: {
                        color: 'rgba(255,255,255,0.9)'
                    }
                },
                xAxis: {
                    type: 'category',
                    data: months,
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,.1)'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: 'rgba(255,255,255,1)',
                            fontSize: 14
                        }
                    }
                },
                yAxis: [
                    {
                        type: 'value',
                        name: '投诉量 (次)',
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'rgba(255,255,255,1)'
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#44aff0'
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: 'rgba(255,255,255,0.9)'
                            }
                        },
                        max: function (value) {
                            return Math.ceil(value.max * 1.2);
                        }
                    },
                    {
                        type: 'value',
                        name: '增长率 (%)',
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'rgba(255,255,255,1)'
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#44aff0'
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: 'rgba(255,255,255,0.9)'
                            }
                        }
                    }
                ],
                grid: {
                    top: '15%',
                    right: '8%',
                    bottom: '12%',
                    left: '8%'
                },
                series: barSeriesData.concat(lineSeriesData)
            };

            myChart.setOption(option);
            window.addEventListener('resize', function () {
                myChart.resize();
            });
        }
    });

    return myChart;
}














function echarts_5() {

    var myChart = echarts.init(document.getElementById('echarts_5'));


    Papa.parse("../车质网汽车投诉.csv", {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: function (results) {
            var data = results.data;


            var monthlyData = {};


            data.forEach(function (item) {
                if (!item['datetime'] || !item['status']) return;

                var datetime = item['datetime'];
                var status = item['status'];
                var month = datetime.substring(5, 7);


                if (month >= '06' && month <= '12') {

                    if (!monthlyData[month]) {
                        monthlyData[month] = {
                            datetime: month + '月',
                            '处理反馈': 0,
                            '用户评分': 0,
                            '信息审核': 0,
                            '厂家受理': 0
                        };
                    }


                    switch (status) {
                        case '处理反馈':
                            monthlyData[month]['处理反馈'] += 1;
                            break;
                        case '用户评分':
                            monthlyData[month]['用户评分'] += 1;
                            break;
                        case '信息审核':
                            monthlyData[month]['信息审核'] += 1;
                            break;
                        case '厂家受理':
                            monthlyData[month]['厂家受理'] += 1;
                            break;
                        default:
                            break;
                    }
                }
            });


            var categories = Object.keys(monthlyData).sort(function (a, b) {
                return parseInt(a) - parseInt(b);
            });

            var seriesData1 = categories.map(function (month) { return monthlyData[month]['处理反馈']; });
            var seriesData2 = categories.map(function (month) { return monthlyData[month]['用户评分']; });
            var seriesData3 = categories.map(function (month) { return monthlyData[month]['信息审核']; });
            var seriesData4 = categories.map(function (month) { return monthlyData[month]['厂家受理']; });


            var option = {
                color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FFD700'],  // 颜色
                tooltip: {
                    trigger: 'axis',  // 提示框触发方式
                    // axisPointer: {
                    //     type: 'cross'  // 指示器类型
                    // }
                },
                legend: {
                    data: ['处理反馈', '用户评分', '信息审核', '厂家受理'],
                    top: 10,
                    textStyle: {
                        color: '#ffffff'
                    }
                },
                grid: {
                    left: '5%',
                    right: '5%',
                    bottom: '5%',
                    top: '20%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: categories.map(function (month) { return monthlyData[month]['datetime']; }),
                    axisLine: {
                        lineStyle: {
                            color: '#ffffff'
                        }
                    },
                    axisLabel: {
                        color: '#ffffff'
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: '#ffffff'
                        }
                    },
                    axisLabel: {
                        color: '#ffffff'
                    }
                },
                series: [
                    {
                        name: '处理反馈',
                        type: 'line',
                        stack: '总量',
                        smooth: true,
                        lineStyle: {
                            width: 0
                        },
                        showSymbol: false,
                        areaStyle: {
                            opacity: 0.8,
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: 'rgb(128, 255, 165)'
                                },
                                {
                                    offset: 1,
                                    color: 'rgb(1, 191, 236)'
                                }
                            ])
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        data: seriesData1
                    },
                    {
                        name: '用户评分',
                        type: 'line',
                        stack: '总量',
                        smooth: true,
                        lineStyle: {
                            width: 0
                        },
                        showSymbol: false,
                        areaStyle: {
                            opacity: 0.8,
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: 'rgb(0, 221, 255)'
                                },
                                {
                                    offset: 1,
                                    color: 'rgb(77, 119, 255)'
                                }
                            ])
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        data: seriesData2
                    },
                    {
                        name: '信息审核',
                        type: 'line',
                        stack: '总量',
                        smooth: true,
                        lineStyle: {
                            width: 0
                        },
                        showSymbol: false,
                        areaStyle: {
                            opacity: 0.8,
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: 'rgb(55, 162, 255)'
                                },
                                {
                                    offset: 1,
                                    color: 'rgb(116, 21, 219)'
                                }
                            ])
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        data: seriesData3
                    },
                    {
                        name: '厂家受理',
                        type: 'line',
                        stack: '总量',
                        smooth: true,
                        lineStyle: {
                            width: 0
                        },
                        showSymbol: false,
                        areaStyle: {
                            opacity: 0.8,
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: 'rgb(255, 215, 0)'
                                },
                                {
                                    offset: 1,
                                    color: 'rgb(255, 255, 0)'
                                }
                            ])
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        data: seriesData4
                    }
                ]
            };


            myChart.setOption(option);
        }
    });
}














function echarts_6() {
    var myChart = echarts.init(document.getElementById('echarts_6'));


    Papa.parse("../车质网汽车投诉排名.csv", {
        download: true,
        header: true,
        complete: function (results) {

            var dataMap = {
                '自主': 0,
                '德系': 0,
                '美系': 0,
                '日系': 0
            };
            var totalComplaints = 0;

            results.data.forEach(function (row) {
                var nationality = row['国别'];
                var count = parseInt(row['数量']);
                if (dataMap.hasOwnProperty(nationality)) {
                    dataMap[nationality] += count;
                    totalComplaints += count;
                }
            });


            var data = [
                { value: dataMap['自主'], name: '自主', itemStyle: { normal: { color: '#f845f1' } } },
                { value: dataMap['德系'], name: '德系', itemStyle: { normal: { color: '#ad46f3' } } },
                { value: dataMap['美系'], name: '美系', itemStyle: { normal: { color: '#5045f6' } } },
                { value: dataMap['日系'], name: '日系', itemStyle: { normal: { color: '#4777f5' } } },

                {
                    value: 0,
                    name: "",
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    }
                },
                {
                    value: 0,
                    name: "",
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    }
                },
                {
                    value: 0,
                    name: "",
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    }
                },
                {
                    value: 0,
                    name: "",
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    }
                },
            ];

            data.forEach(function (item) {
                var percent = ((item.value / totalComplaints) * 100).toFixed(2);
                item.label = {
                    normal: {
                        show: ['自主', '德系', '日系', '美系'].includes(item.name),
                        formatter: '{c}辆'
                    }
                };
                item.tooltip = {
                    formatter: "{b}  <br/>{c}辆 <br/>占比：" + percent + "%"
                };
            });


            var option = {
                backgroundColor: 'rgba(0,0,0,0)',
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}  <br/>{c}辆 ({d}%)<br/>占比：{a}%"
                },
                legend: {
                    x: 'center',
                    y: '2%',
                    data: ['自主', '德系', '美系', '日系'],
                    icon: 'circle',
                    textStyle: {
                        color: '#fff',
                    }
                },
                calculable: true,
                grid: {
                    left: '7%',
                    right: '',
                    bottom: '',
                    top: '',
                    containLabel: true
                },
                series: [{
                    name: '车型',
                    type: 'pie',
                    startAngle: 0,
                    radius: [41, 110],
                    center: ['50%', '20%'],
                    roseType: 'area',
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: true,
                            formatter: '{c}辆'
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    labelLine: {
                        normal: {
                            show: true,
                            length2: 1,
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    data: data
                }]
            };


            myChart.setOption(option);
        }
    });


    window.addEventListener("resize", function () {
        myChart.resize();
    });
}










function echarts_7() {
    var myChart = echarts.init(document.getElementById('echarts_7'));


    var brightColors = ['#FF4500', '#FFD700', '#FF69B4', '#00BFFF', '#7CFC00'];


    Papa.parse("车质网汽车投诉.csv", {
        download: true,
        complete: function (results) {
            var data = results.data;


            var descriptions = [];
            for (var i = 1; i < data.length; i++) {
                var description = data[i][4];
                if (description) {
                    descriptions.push(description);
                }
            }


            var wordCounts = {};
            var chineseRegExp = /[\u4e00-\u9fa5]+/g;
            descriptions.forEach(function (desc) {
                if (desc) {
                    var words = desc.match(chineseRegExp);
                    if (words) {
                        words.forEach(function (word) {
                            word = word.trim();
                            if (word.length > 1) {
                                if (word in wordCounts) {
                                    wordCounts[word] += 1;
                                } else {
                                    wordCounts[word] = 1;
                                }
                            }
                        });
                    }
                }
            });


            var seriesData = Object.keys(wordCounts).map(function (word, index) {
                var randomIndex = Math.floor(Math.random() * brightColors.length);
                var randomColor = brightColors[randomIndex];

                return {
                    name: word,
                    value: wordCounts[word],
                    textStyle: {
                        color: randomColor
                    },
                    emphasis: {
                        textStyle: {
                            fontSize: Math.random() * 40 + 12,
                            color: randomColor
                        }
                    }
                };
            }).sort(function (a, b) {
                return b.value - a.value;
            }).slice(0, 40);


            var option = {
                tooltip: {
                    show: true
                },
                series: [{
                    type: 'wordCloud',
                    gridSize: 2,
                    sizeRange: [12, 50],
                    rotationRange: [-90, 90],
                    shape: 'circle',
                    textStyle: {
                        normal: {
                            color: function () {
                                return 'rgb(' + [
                                    Math.round(Math.random() * 95 + 160),
                                    Math.round(Math.random() * 95 + 160),
                                    Math.round(Math.random() * 95 + 160)
                                ].join(',') + ')';
                            }
                        },
                        emphasis: {
                            shadowBlur: 10,
                            shadowColor: '#333'
                        }
                    },
                    data: seriesData
                }]
            };


            myChart.setOption(option);


            window.addEventListener('resize', function () {
                myChart.resize();
            });
        }
    });
}
















