var map;
function addRegion() {
    //加载行政区划插件
    AMap.service('AMap.DistrictSearch', function() {
        var opts = {
            subdistrict: 1,   //返回下一级行政区
            extensions: 'all',  //返回行政区边界坐标组等具体信息
            level: 'city'  //查询行政级别为 市
        };
        //实例化DistrictSearch
        district = new AMap.DistrictSearch(opts);
        district.setLevel('district');
        //行政区查询
        district.search('河北省', function(status, result) {
            var bounds = result.districtList[0].boundaries;
            var polygons = [];
            if (bounds) {
                for (var i = 0, l = bounds.length; i < l; i++) {
                    //生成行政区划polygon
                    var polygon = new AMap.Polygon({
                        map: map,
                        strokeWeight: 3,
                        path: bounds[i],
                        fillOpacity: 0,
                        fillColor: '#CCF3FF',
                        strokeColor: '#306DCD',
                        strokeStyle: 'dashed'
                    });
                    polygon.on('click', _map_click);
                    polygons.push(polygon);
                }
                map.setFitView();//地图自适应
            }
        });
    });
}
function _getUrl(url) {
    return 'http://192.168.0.20:8000/weather/'+url;
}
function _formatNum(num) {
    if (num < 0) {
        return '0' + num;
    }
    return num;
}
Date.prototype.format = function(format,is_not_second){
    format || (format = 'yyyyMMddhhmm');
    var o = {
        "M{2}" : this.getMonth()+1, //month
        "d{2}" : this.getDate(),    //day
        "h{2}" : this.getHours(),   //hour
        "m{2}" : this.getMinutes(), //minute
        "q{2}" : Math.floor((this.getMonth()+3)/3),  //quarter
    }
    if(!is_not_second){
        o["s{2}"] = this.getSeconds(); //second
        o["S{2}"] = this.getMilliseconds() //millisecond
    }
    if(/(y{4}|y{2})/.test(format)){
        format = format.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));
    } 
    for(var k in o){
        if(new RegExp("("+ k +")").test(format)){
            format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] :("00"+ o[k]).substr((""+ o[k]).length));
        }
    }
    
    return format;
}

var $right_bar = $('.right_bar');
var $content_wrap = $('.content_wrap').delegate('.sk', 'click', function() {

});
function _getTimeParam(befor_hours) {
    var now = new Date();
    var now_str = now.format();
    now.setHours(now.getHours() - befor_hours||2);
    var before_str = now.format();

    return 'stime='+before_str+'&etime='+now_str;
}
function _showStationInfo(v) {
    $right_bar.removeClass('long');
    // $content_wrap.addClass('loading');

    _getJson('getStationData?'+_getTimeParam()+'&stationcode='+v.stationCode+'&isHour=false', function(data) {
        // $content_wrap.removeClass('loading');
        var d = data.data;
        var last_item = d[d.length - 1];
        var html = '';
        var temp = last_item.temp;
        if (temp) {
            html += '温度：'+(temp)+'℃<br/>';
        }
        var humi = last_item.humi;
        if (humi) {
            html += '湿度：'+temp+'%<br/>';
        }
        var rain = last_item.rain;
        if (rain) {
            html += '降水：'+rain+'mm<br/>';
        }
        var windspeed = last_item.windspeed;
        if (windspeed) {
            html += '风速：'+windspeed+'m/s<br/>';
        }
        var visi = last_item.visi;
        if (visi) {
            html += '能见度：'+visi+'m<br/>';
        }

        var is_no_data = !html;
        html = v.stationName + '<br/><br/>' + html;

        if (is_no_data) {
            html += '暂无其它要素';
        }
        $content_wrap.html('<div class="sk">'+html+'</div>');
        _showInfo();
    }, true);
}

var _cache = {};
function _getJson(url, cb, is_cache) {
    if (is_cache) {
        var val_cache = _cache[url];
        if (val_cache) {
            return cb (val_cache);
        }
    }
    _showLoading();
    $.getJSON(_getUrl(url), function(data) {
        if (is_cache) {
            _cache[url] = data;
        }
        _hideLoading();
        cb(data);
    })
}
function _translate(zuobiao) {
    var m = /(\d+)\.(\d{1,2})(\d{2,})?/.exec(zuobiao);
    if (m) {
        var a = m[1],
            b = m[2],
            c = m[3];
        var result = parseFloat(a) + (parseFloat(b)/60) + ((parseFloat(c) || 0)/3600);
        return result;
    }
}

var _arr_marker = [];
function _vacuateArray(arr, num) {
    num || (num = Math.floor(arr.length / 3));
    arr = arr.slice(0);
    function rn() {
        return Math.floor(Math.random() * arr.length);
    }
    var arr_new = [];
    for (var i = 0; i<num; i++){
        var item = arr.splice(rn(), 1);
        arr_new.push(item[0]);
    }
    return arr_new;
}
function _getStationList() {
    _getJson('getStationList?type=qy', function(data) {
        _clear();
        $.each(_vacuateArray(data), function(i, v) {
            var marker = new AMap.Marker({
                icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                position: [v.lon, v.lat]
            });
            // marker.setLabel({//label默认蓝框白底左上角显示，样式className为：amap-marker-label
            //     // offset: new AMap.Pixel(20, 20),//修改label相对于maker的位置
            //     content: v.stationName
            // });
            marker.on('click', function() {
                _showStationInfo(v);
            });
            marker.setMap(map);
            _arr_marker.push(marker);
        });
    }, true);
}
function _clear() {
    // map.clearMap();
    var arr = _arr_marker.splice(0);
    map.remove(arr);
}
function init(){
    map = new AMap.Map('container', {
        center: [117.000923, 36.675807],
        zoom: 6
    });
    map.plugin(["AMap.ToolBar"], function() {
        map.addControl(new AMap.ToolBar());
    });
}

init();
addRegion();

var $loading = $('.loading');
function _hideInfo() {
    $right_bar.css('opacity', 0);
}
function _showInfo() {
    $right_bar.css('opacity', 1);
}
function _showLoading() {
    $loading.show();
}
function _hideLoading() {
    $loading.hide();
}
var _ec;
require_web.config({
    paths: {
        echarts: './'
    }
});
require_web(['echarts', 'echarts/chart/bar', 'echarts/chart/line'], function(ec) {
    _ec = ec;
    
});
var _cache_trafic_chart = {};
function _showTraficChart(key) {
    var val_cache = _cache_trafic_chart[key];
    if (!val_cache) {
        return;
    }
    var conf = val_cache.conf;
    var xAxis = val_cache.xAxis;

    var html = '';
    $.each(conf, function(i, v) {
        html += '<div class="chart_wrap '+v.cn+'"></div>'
    });
    $content_wrap.html('<div class="chart">'+html+'</div>');
    _showInfo();

    $.each(conf, function(i, v) {
        _initChart($content_wrap.find('.'+v.cn), v, xAxis);
    });
}
$content_wrap.delegate('._chart_', 'click', function() {
    _showTraficChart($(this).data('key'));
});
var _data_trafic;
var $trafic_list = $('#btn_type_traffic ul');
$.getJSON('./trafic.json', function(data) {
    _data_trafic = data;
    
    var html = '';
    $.each(data, function(i, v) {
        html += '<li>'+v.lineName+'</li>';
        
        var arr = [];
        $.each(v.lineData, function(ii, vv) {
            arr.push((vv.lon+'_'+vv.lat).trim());
        });
        v.lnglat = arr.join(',');
    });

    $trafic_list.html(html).delegate('li', 'click', function(e) {
        e.stopPropagation();
        $trafic_list.hide();
        $(this).addClass('on').siblings().removeClass('on');
        var index = $(this).index();
        var d_trafic = _data_trafic[index];
        var url;
        var lnglat = d_trafic.lnglat;
        _clear();
        if (type == 'sk') {
            url = 'getGridDataO?lon_lat='+lnglat;
            _getJson(url, function(data) {
                var html = '<div class="title">"'+d_trafic.lineName+'"交通实时路况</div>';
                $.each(data, function(i, v) {
                    var item = v.data[0];
                    var name = d_trafic.lineData[i].stationName;
                    html += '<div class="line_station_info">'
                    html += '<div class="name">'+name+'</div>';
                    html += '<div>'
                    var temp = item.temp;
                    if (temp) {
                        html += '温度：'+_translatTemp(temp)+'℃<br/>';
                    }
                    var humi = item.humi;
                    if (humi) {
                        html += '湿度：'+temp+'%<br/>';
                    }
                    var rain = item.rain;
                    if (rain) {
                        html += '降水：'+rain+'mm<br/>';
                    }
                    var windspeed = item.windspeed;
                    if (windspeed) {
                        html += '风速：'+windspeed+'m/s<br/>';
                    }
                    var visi = item.visi;
                    if (visi) {
                        html += '能见度：'+visi+'m<br/>';
                    }
                    html += '</div>';
                    html += '</div>';
                    var marker = new AMap.Marker({
                        icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                        position: [v.lon, v.lat]
                    });
                    marker.setLabel({//label默认蓝框白底左上角显示，样式className为：amap-marker-label
                        offset: new AMap.Pixel(20, 0),
                        content: name
                    });
                    marker.setMap(map);
                    _arr_marker.push(marker);

                });
                $content_wrap.html('<div class="trafic">'+html+'</div>');
                _showInfo();
            }, true);
        } else {
            _getJson('getGridDataF?lon_lat='+lnglat, function(data) {
                var now = new Date();
                var html = '<div class="title">"'+d_trafic.lineName+'"交通预报路况</div>';
                $.each(data, function(i, v_item) {
                    var _item = v_item.data;
                    var item = _item[0];
                    for (var _i = 0, _j = _item.length; _i<_j; _i++) {
                        var time = _item[_i].time;
                        var d = new Date(time.substr(0,4)+'/'+time.substr(4, 2)+'/'+time.substr(6, 2)+' '+time.substr(8,2)+':'+time.substr(10, 2)+':'+time.substr(12, 2));
                        if (d.getTime() > now.getTime()) {
                            item = _item[i];
                            break;
                        }
                    }
                    
                    var xAxis = [];
                    var y_temp = []; //2米温度
                    var y_rain = []; //1小时降水
                    var y_roadtemp = []; //路面温度
                    var y_sd = [];//湿度
                    for (var _i = 0, _j = _item.length; _i<_j; _i++) {
                        var v = _item[_i];
                        var time = v.time;
                        var d = new Date(time.substr(0,4)+'/'+time.substr(4, 2)+'/'+time.substr(6, 2)+' '+time.substr(8,2)+':'+time.substr(10, 2)+':'+time.substr(12, 2));
                        if (d.getTime() > now.getTime()) {
                            xAxis.push(time.substr(8, 2)+':'+time.substr(10, 2));
                            y_temp.push(isNaN(v['3'])?'-':_translatTemp(parseFloat(v['3'])));
                            y_rain.push(isNaN(v['0'])?'-':parseFloat(v['0']));
                            y_roadtemp.push(isNaN(v.roadtemp)?'-':parseFloat(v.roadtemp));
                            y_sd.push(isNaN(v['1'])?'-':parseFloat(v['1']));
                        }
                    }
                    
                    var conf = [{
                        name: '2米温度',
                        cn: 'temp',
                        data: y_temp,
                        unit: '℃'
                    }, {
                        name: '1小时降水',
                        cn: 'rain',
                        data: y_rain,
                        unit: 'mm',
                        min: 0,
                        splitNumber: 1,
                        type: 'bar'
                    }, {
                        name: '路面温度',
                        cn: 'roadtemp',
                        data: y_roadtemp,
                        unit: '℃',
                        type: 'bar'
                    }, {
                        name: '湿度',
                        cn: 'sd',
                        data: y_sd,
                        unit: '%',
                    }];
                    
                    var name = d_trafic.lineData[i].stationName;

                    var key = "yb_"+name;
                    _cache_trafic_chart[key] = {
                        conf: conf,
                        xAxis: xAxis
                    }
                    html += '<div class="line_station_info _chart_" data-key="'+key+'">'
                    html += '<div class="name">'+name+'</div>';
                    html += '<div>'
                    var val = item['0'];
                    if (val) {
                        html += '1小时降雨：'+val+'mm<br/>';
                    }
                    val = item['1'];
                    if (val) {
                        html += '2米相对湿度：'+val+'%<br/>';
                    }
                    val = item['3'];
                    if (val) {
                        html += '2米温度：'+val+'℃<br/>';
                    }
                    val = item.roadtemp;
                    if (val) {
                        html += '路面温度：'+val+'℃<br/>';
                    }
                    val = item['15'];
                    if (val) {
                        html += '能见度：'+val+'m<br/>';
                    }
                    html += '</div>';
                    html += '</div>';
                    var marker = new AMap.Marker({
                        icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                        position: [v_item.lon, v_item.lat]
                    });
                    marker.setLabel({//label默认蓝框白底左上角显示，样式className为：amap-marker-label
                        offset: new AMap.Pixel(20, 0),
                        content: name
                    });
                    marker.on('click', function() {
                        _showTraficChart(key);
                    });
                    marker.setMap(map);
                    _arr_marker.push(marker);

                });
                $content_wrap.html('<div class="trafic">'+html+'</div>');
                _showInfo();
            }, true);
        }
    });
});
function _rnd() {
    return Math.floor(Math.random() * 255);
}
function _getColor() {
    return 'rgb('+_rnd()+', '+_rnd()+', '+_rnd()+')'
}
function _initChart($container, v, xAxis) {
    var option = {
        color: [_getColor(), _getColor()],
        legend: {
            data: [v.name]
        },
        tooltip : {
            trigger: 'axis'
        },
        grid: {
            x: 45, 
            y: 30,
            x2: 10,
            y2: 30
        },
        xAxis: [{
            type: 'category',
            data: xAxis,
            // axisLabel: {
            //     rotate: -60,
            //     // formatter: function(v) {
            //     //     // var d = new Date(v);
            //     //     // return (d.getMonth()+1)+'-'+d.getDate();
            //     // }
            // }
        }],
        yAxis: [{
            type: 'value',
            position: 'left',
            axisLabel: {
                formatter: '{value} '+v.unit
            }
        }],
        series: [{
            "name": v.name,
            "type": v.type||'line',
            "data": v.data,
            // itemStyle: itemStyle
        }]
    }
    if ('min' in v) {
        option.yAxis[0].min = v.min;
    }
    if ('splitNumber' in v) {
        option.yAxis[0].splitNumber = v.splitNumber;
    }
    var myChart = _ec.init($container.get(0)); 
    myChart.setOption(option); 
}
function _translatTemp(temp) {
    //return Number(temp - 272.15).toFixed(2);
    return Number(temp).toFixed(2);
}
function _renderGedian(data, lng, lat) {
    var str = '<center>经度：'+lng+' 纬度：'+lat+'</center><br/>';
    if (_ec) {
        $right_bar.addClass('long');
        if (type == 'sk') {
            var html = str;
            $.each(['precipitation', 'temp', 'humidity'], function(i, v) {
                html += '<div class="chart_wrap '+v+'"></div>'
            });
            $content_wrap.html('<div class="chart">'+html+'</div>');
            _showInfo();

            var xAxis = [];
            var y_temp = [];
            var y_humidity = [];
            var y_precipitation = [];
            $.each(data.data, function(i, v) {
                xAxis.push(v.time.substr(8, 2)+':'+v.time.substr(10, 2));
                y_temp.push(isNaN(v.temp)?'-':_translatTemp(parseFloat(v.temp)));
                y_humidity.push(isNaN(v.humidity)?'-':parseFloat(v.humidity));
                y_precipitation.push(isNaN(v.precipitation)?'-':parseFloat(v.precipitation));
            });
            $.each([{
                name: '温度',
                cn: 'temp',
                data: y_temp,
                unit: '℃'
            }, {
                name: '降水量',
                cn: 'precipitation',
                data: y_precipitation,
                unit: 'mm',
                min: 0,
                splitNumber: 1,
                type: 'bar'
            }, {
                name: '湿度',
                cn: 'humidity',
                data: y_humidity,
                unit: '%',
            }], function(i, v) {
                _initChart($content_wrap.find('.'+v.cn), v, xAxis);
            });
        } else {
            var now = new Date();

            var html = str;
            $.each(['rain', 'temp', 'roadtemp', 'sd'], function(i, v) {
                html += '<div class="chart_wrap '+v+'"></div>'
            });
            $content_wrap.html('<div class="chart">'+html+'</div>');
            _showInfo();

            var xAxis = [];
            var y_temp = []; //2米温度
            var y_rain = []; //1小时降水
            var y_roadtemp = []; //路面温度
            var y_sd = [];//湿度
            $.each(data.data, function(i, v) {
                var time = v.time;
                var d = new Date(time.substr(0,4)+'/'+time.substr(4, 2)+'/'+time.substr(6, 2)+' '+time.substr(8,2)+':'+time.substr(10, 2)+':'+time.substr(12, 2));
                if (d.getTime() > now.getTime()) {
                    xAxis.push(v.time.substr(8, 2)+':'+v.time.substr(10, 2));
                    y_temp.push(isNaN(v['3'])?'-':_translatTemp(parseFloat(v['3'])));
                    y_rain.push(isNaN(v['0'])?'-':parseFloat(v['0']));
                    y_roadtemp.push(isNaN(v.roadtemp)?'-':parseFloat(v.roadtemp));
                    y_sd.push(isNaN(v['1'])?'-':parseFloat(v['1']));
                }
            });
            $.each([{
                name: '2米温度',
                cn: 'temp',
                data: y_temp,
                unit: '℃'
            }, {
                name: '1小时降水',
                cn: 'rain',
                data: y_rain,
                unit: 'mm',
                min: 0,
                splitNumber: 1,
                type: 'bar'
            }, {
                name: '路面温度',
                cn: 'roadtemp',
                data: y_roadtemp,
                unit: '℃',
                type: 'bar'
            }, {
                name: '湿度',
                cn: 'sd',
                data: y_sd,
                unit: '%',
            }], function(i, v) {
                _initChart($content_wrap.find('.'+v.cn), v, xAxis);
            });
        }
    }
}
var STAT_GEDIAN = false;
function _map_click(e) {
    if (!STAT_GEDIAN) {
        return;
    }
    var lng = e.lnglat.getLng(),
        lat = e.lnglat.getLat();

    var url;
    if (type == 'sk') {
        url = 'getGridDataO?'+_getTimeParam(24)+'&lon_lat='+lng+'_'+lat;
    } else {
        url = 'getGridDataF?lon_lat='+lng+'_'+lat;
    }
    _getJson(url, function(data) {
        // console.log(url, data);
        _renderGedian(data[0], lng, lat);
    });
}
map.on('click', _map_click);
function _getGeDian(e) {
    e.stopPropagation();
    _clear();
    STAT_GEDIAN = true;
}

var type = 'sk';
var $btn_sk = $('#btn_sk'),
    $btn_yb = $('#btn_yb');
var $btn_type_station = $('#btn_type_station');
$('.left_bar .btn').click(function() {
    $(this).addClass('on').siblings().removeClass('on');
    STAT_GEDIAN = false;
    _hideInfo();
});
$btn_sk.click(function() {
    type = 'sk';
    $(this).addClass('on').siblings().removeClass('on');
    $btn_type_station.show();
});

$('#btn_yb').click(function() {
    type = 'yb';
    $(this).addClass('on').siblings().removeClass('on');
    $btn_type_station.hide();
});
$btn_type_station.click(function(e) {
    e.stopPropagation();
    _getStationList();
});
$('#btn_type_gedian').click(_getGeDian);
$('#btn_type_traffic').click(function() {
    $trafic_list.show();
});