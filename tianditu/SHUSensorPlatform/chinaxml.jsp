<%@ page contentType="text/xml; charset=utf-8" language="java"      
import="java.util.*" pageEncoding="utf-8"%>
<%@ page  import="java.sql.*"%>
<%@ page  import="java.io.*"%>
<%@page import="java.net.*"%>
<%  
    request.setCharacterEncoding("utf-8");
    String strURL="http://flash.weather.com.cn/wmaps/xml/china.xml";
        String temp="";  
        String content = "";
        try{  
            URL url = new URL(strURL);  
            HttpURLConnection conn = (HttpURLConnection)url.openConnection();  
            InputStream is = conn.getInputStream();  
            BufferedReader br = new BufferedReader(new InputStreamReader(is,"utf-8"));  
            StringBuilder sb = new StringBuilder(); 
           // String callback = request.getParameter("callback");  
           // sb.append(callback);
            //out.println((content = br.readLine()) != null);
            while ((content = br.readLine())!=null) {  
             sb.append(content);  
            }  
            temp= sb.toString();
			//temp=new String(request.getParameter(temp).getBytes("ISO8859_1"));
           // System.out.println(temp);  
            br.close();  
        }catch(Exception e){  
            e.printStackTrace();  
        }
		
        out.println(temp);
		
%>  