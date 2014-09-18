<?php
$ch = curl_init();
// http://yuntuapi.amap.com/datasearch/local?tableid=52b155b6e4b0bc61deeb7629&city=北京市&keywords= &filter=type:写字楼&limit=50&page=1&key=b275e5bb60f88f24dc042cb1d1a518d0
curl_setopt ($ch, CURLOPT_URL,'http://yuntuapi.amap.com/datasearch/local?key=b275e5bb60f88f24dc042cb1d1a518d0&tableid=53f1740be4b0dfd37f7460ab&keywords='.urlencode(' ').'&city='.urlencode('全国').'&limit=50&page=1&sig=MIHHAgEAMIGoBgcqhkjOOAQBMIGcAkEA%2FKaCzo4Syrom78z3EQ5SbbB4sF7ey80etKII864WF64B81uRpH5t9jQTxeEu0ImbzRMqzVDZkVG9xD7nN1kuFwIVAJYu3cw2nLqOuyYO5rahJtk0bjjFAkBnhHGyepz0TukaScUUfbGpqvJE8FpDTWSGkx0tFCcbnjUDC3H9c9oXkGmzLik1Yw4cIGI1TQ2iCmxBblC%2BeUykBBcCFQCGVwjlskPLT6aRb5c0d%2Fba%2BvT0Qw%3D%3D');
//curl_setopt ($ch, CURLOPT_HTTPHEADER , $headerArr );

curl_setopt ($ch, CURLOPT_REFERER, "http://yuntuapi.amap.com/");

curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

//curl_setopt( $ch, CURLOPT_HEADER, 1);

$out = curl_exec($ch);

curl_close ($ch);
echo $out;

// $content = file_get_contents('http://yuntuapi.amap.com/datasearch/local?key=b275e5bb60f88f24dc042cb1d1a518d0&tableid=53f1632ae4b01943f1f10f19&keywords='.urlencode(' ').'&city='.urlencode('全国').'&limit=50&page=1');
// echo $content;