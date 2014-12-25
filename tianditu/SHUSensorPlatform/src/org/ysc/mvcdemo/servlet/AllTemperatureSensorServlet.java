package org.ysc.mvcdemo.servlet ;
import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.validator.Var;
import org.viky.swe.webclient.sos.SOSClientLite;
import org.viky.swe.webclient.sos.data.ObservableProperty;
import org.viky.swe.webclient.sos.data.PointTimePair;
import org.viky.swe.webclient.sos.data.ResultOneObsPro;
import org.viky.swe.webclient.sos.exception.GetObservationParaNotCorrectException;
import org.viky.swe.webclient.sos.exception.NetworkException;
import org.viky.swe.webclient.sos.exception.NoResultException;
import org.viky.swe.webclient.sos.exception.ObservedPropertyAllNotExistException;
import org.viky.swe.webclient.sos.exception.OfferingIDNotExistException;
import org.viky.swe.webclient.sos.exception.OtherException;
import org.viky.swe.webclient.sos.exception.SensorIDAllNotExistException;
import org.ysc.sosClient.sosClientLite;
public class AllTemperatureSensorServlet extends HttpServlet {
	public void doGet(HttpServletRequest req,HttpServletResponse resp) throws ServletException,IOException{
		String path = "windspeed-test-demo-TEST.jsp" ;
		//String sensorID1 = "urn:liesmars:object:feature:HumiditySensor1";
		//String sensorID2 = "urn:liesmars:object:feature:HumiditySensor2";
		//String sensorID3 = "urn:liesmars:object:feature:HumiditySensor3";
		//String sensorID4 = "urn:liesmars:object:feature:HumiditySensor4";
		//String sensorID5 = "urn:liesmars:object:feature:HumiditySensor5";
		sosClientLite sosClientLite2=new sosClientLite("http://vsisos.shu.edu.cn:84/SOS/sos");
		sosClientLite2.setOffering("LIESMARS");
	/*	String infoString=sosClientLite.getSensorObservedValue("urn:liesmars:object:feature:Platform:Station:Weather:sta-a001",
				"urn:liesmars:def:phenomenon:LIESMARS:1.0.0:WindDirection");
		String infoString2=sosClientLite.getSensorObservedTime("urn:liesmars:object:feature:Platform:Station:Weather:sta-a001",
				"urn:liesmars:def:phenomenon:LIESMARS:1.0.0:WindDirection");
		String infoString3=sosClientLite.getSensorLatestPosition("urn:liesmars:object:feature:Platform:Station:Weather:sta-a001",
			"urn:liesmars:def:phenomenon:LIESMARS:1.0.0:WindDirection");
	*/	
		String[] arr=sosClientLite2.getSensorIdListByProperty("urn:liesmars:def:phenomenon:LIESMARS:1.0.0:Temperature");
		
		int length=arr.length;
		SOSClientLite sosClientLite = new SOSClientLite(
				"http://vsisos.shu.edu.cn:84/SOS/sos");
		
		PointTimePair pointTimePair=null;
		String x[]=  new String[length];
		String y[]=  new String[length];
		String obsvalue[]=  new String[length];
		
		List<ObservableProperty> IDList;
		String s1 = null;
		String s2;
		String name[]= new String[length];
	    String time[]= new String[length];
	    String obstime[]= new String[length];
	    String obsPro[]= new String[length];
	    String obsPro2=null;
		
		ResultOneObsPro sensorDataPair1 = null;
	    ResultOneObsPro sensorDataPair2 = null;
	    
	    for(int i=0;i<arr.length;i++){

		 try {
			pointTimePair=sosClientLite.getSensorLatestPosition("LIESMARS",arr[i]);
		} catch (OtherException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (OfferingIDNotExistException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (SensorIDAllNotExistException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (NetworkException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (NoResultException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
			x[i]=String.valueOf(pointTimePair.getX());
			y[i]=String.valueOf(pointTimePair.getY());
			
		  name[i]=arr[i].substring((arr[i].lastIndexOf(":")+1) ,arr[i].length()) ;
		  
		  
		  
		  try {
			IDList = sosClientLite.getObservedPropertyBySensorID(arr[i]);
			for(int j=0;j<IDList.size();j++){
				s1=IDList.get(j).getDefinition().toString();
				 s2 = IDList.get(j).getName();
				if(s1.contains("Temperature")){
					 obsPro2=s1;
				}
				if(s2.contains("Temperature")){
					 obsPro[i]=s2;
				}
			}
		} catch (NetworkException e2) {
			// TODO Auto-generated catch block
			e2.printStackTrace();
		} catch (OtherException e2) {
			// TODO Auto-generated catch block
			e2.printStackTrace();
		} catch (SensorIDAllNotExistException e2) {
			// TODO Auto-generated catch block
			e2.printStackTrace();
		}
	          try {
				sensorDataPair2 = sosClientLite.getObservationLatestOneObsPro("LIESMARS",arr[i],obsPro2);
			} catch (OtherException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			} catch (OfferingIDNotExistException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			} catch (SensorIDAllNotExistException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			} catch (ObservedPropertyAllNotExistException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			} catch (NetworkException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			} catch (NoResultException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			} catch (GetObservationParaNotCorrectException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
	          time[i] =sensorDataPair2.getObservedTime().toLocalDateTime().toString();
			  obstime[i]=time[i].replace("T"," "); 
	        String unit;
	      try {
			sensorDataPair1 = sosClientLite.getObservationLatestOneObsPro("LIESMARS",arr[i],obsPro2);
			unit=sensorDataPair1.getProperty().getUnit();
	        Object value=sensorDataPair1.getValue();
	        String value2=value.toString();
            obsvalue[i]=value2;
		} catch (OtherException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (OfferingIDNotExistException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SensorIDAllNotExistException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ObservedPropertyAllNotExistException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (NetworkException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (NoResultException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (GetObservationParaNotCorrectException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}  
	    }
	
		 
		  
		  ////

	  req.setAttribute("name",name) ;
	  req.setAttribute("x",x) ;
	  req.setAttribute("y",y) ;
	  req.setAttribute("obstime",obstime) ;
	  req.setAttribute("obsPro",obsPro);
	 // req.setAttribute("value",value) ;
	  req.setAttribute("obsvalue",obsvalue) ;
	  //
	 
	  
	  
		req.getRequestDispatcher(path).forward(req,resp) ;
	}
	public void doPost(HttpServletRequest req,HttpServletResponse resp) throws ServletException,IOException{
		this.doGet(req,resp) ;
	}


}