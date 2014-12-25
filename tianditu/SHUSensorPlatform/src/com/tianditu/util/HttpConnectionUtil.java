package com.tianditu.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;


public class HttpConnectionUtil {
	public static String AccessUrl(String url,String postString){
		String result = null;
		HttpURLConnection conn = null;
		try {
			URL postUrl = new URL(url);
			conn = (HttpURLConnection)postUrl.openConnection();
			conn.setRequestMethod("POST");				
			conn.setDoOutput(true);   
			conn.setDoInput(true);   
			conn.setUseCaches(false);
			conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
			conn.setConnectTimeout(30000);
			conn.setReadTimeout(300000);
//			System.out.println("content锛氬紑濮嬩紶閫�);
			OutputStream os = conn.getOutputStream();
			os.write(postString.getBytes("utf-8")); // 寰�繙绋婾RL浼犻�鍙傛暟			          
            os.flush();
            os.close();
            
            int code = conn.getResponseCode();
//            System.out.println("杩斿洖鐘舵�鐮侊細"+code+", 杩斿洖闀垮害锛�+conn.getContentLength());
            conn.getHeaderFields();
            conn.getContentLength();
            if(code==200){//杩斿洖鎴愬姛
            	BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"));
            	String line;
            	StringBuffer buffer = new StringBuffer();
            	while((line = reader.readLine()) != null) {
            		buffer.append(line);
            	}
            	result = buffer.toString();
            }else{
            	System.out.println("code有误");
            }
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return result;
	}
	/**
	 * 鎺墂ebservice鏈嶅姟锛屽ぉ姘旈鎶�
	 * @param url
	 * @return
	 */
	public static InputStream getSoapInputStream(String url){
	    InputStream inputStream = null;
	    try{
			URL urlObj = new URL(url);
			URLConnection urlConn = urlObj.openConnection();
			urlConn.setRequestProperty("Host", "www.webxml.com.cn");    //鍏蜂綋webService鐩稿叧
			urlConn.connect();
			inputStream = urlConn.getInputStream();
		}catch(MalformedURLException e){
			e.printStackTrace();
		}catch(IOException e){
			e.printStackTrace();
		}
	    return inputStream;
	}

}
