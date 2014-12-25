<%@ page language="java" import="java.util.*" contentType="text/xml; charset=utf-8" pageEncoding="utf-8"%>
<%@ page  import="java.sql.*"%>
<%@ page  import="java.io.*"%>
<%@page import="java.net.*"%>
<%
    response.setCharacterEncoding("utf-8");
    String strURL="http://www.pm25.in/api/querys/pm2_5.json?city=shanghai&token=SkH1xkQ9WQQzmg556Zbp";
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
            while ((content = br.readLine()) != null) {  
             sb.append(content);  
            }  
            temp= new String(sb);  
			
           // System.out.println(temp);  
            br.close();  
        }catch(Exception e){  
            e.printStackTrace();  
        }
		
        out.println(temp);
		
%>  
