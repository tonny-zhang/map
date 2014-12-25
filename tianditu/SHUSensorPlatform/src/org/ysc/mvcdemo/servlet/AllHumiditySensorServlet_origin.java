package org.ysc.mvcdemo.servlet ;
import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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
public class AllHumiditySensorServlet extends HttpServlet {
	public void doGet(HttpServletRequest req,HttpServletResponse resp) throws ServletException,IOException{
		String path = "humidity-test-demo.jsp" ;
		String sensorID1 = "urn:liesmars:object:feature:HumiditySensor1";
		String sensorID2 = "urn:liesmars:object:feature:HumiditySensor2";
		String sensorID3 = "urn:liesmars:object:feature:HumiditySensor3";
		String sensorID4 = "urn:liesmars:object:feature:HumiditySensor4";
		String sensorID5 = "urn:liesmars:object:feature:HumiditySensor5";
		SOSClientLite sosClientLite = new SOSClientLite(
				"http://localhost:84/SOS/sos");
		PointTimePair pointTimePair=null;
		double x;
		double y;
		
		List<ObservableProperty> IDList;
		String s1 = null;
		String s2;
		String name;
	    String time;
		
		ResultOneObsPro sensorDataPair1 = null;
	    ResultOneObsPro sensorDataPair2 = null;

		 try {
			pointTimePair=sosClientLite.getSensorLatestPosition("LIESMARS",sensorID1);
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
			x=pointTimePair.getX();
			y=pointTimePair.getY();
			
		  name=sensorID1.substring((sensorID1.lastIndexOf(":")+1) ,sensorID1.length()) ;
		  String obsPro=null;
		  String obsPro2=null;
		  
		  try {
			IDList = sosClientLite.getObservedPropertyBySensorID(sensorID1);
			for(int i=0;i<IDList.size();i++){
				s1=IDList.get(i).getDefinition().toString();
				 s2 = IDList.get(i).getName();
				if(s1.contains("Humidity")){
					 obsPro2=s1;
				}
				if(s2.contains("Humidity")){
					 obsPro=s2;
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
				sensorDataPair2 = sosClientLite.getObservationLatestOneObsPro("LIESMARS",sensorID1,obsPro2);
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
	          time =sensorDataPair2.getObservedTime().toLocalDateTime().toString();
			   String obstime=time.replace("T"," "); 
	        String unit;
	      try {
			sensorDataPair1 = sosClientLite.getObservationLatestOneObsPro("LIESMARS",sensorID1,obsPro2);
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
		  unit=sensorDataPair1.getProperty().getUnit();
	  String value=sensorDataPair1.getValue()+"  "+"%RH";
	  Double obsvalue=(Double) sensorDataPair1.getValue();
	  
	  
	  //修改
	  
	  PointTimePair pointTimePair2=null;
		double x2;
		double y2;
		
		List<ObservableProperty> IDList2;
		String s4 = null;
		String s5;
		
		String name2;
	    String time2;
		
		ResultOneObsPro sensorDataPair3 = null;
	    ResultOneObsPro sensorDataPair4 = null;

		 try {
			pointTimePair2=sosClientLite.getSensorLatestPosition("LIESMARS",sensorID2);
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
			x2=pointTimePair2.getX();
			y2=pointTimePair2.getY();
			
		  name2=sensorID2.substring((sensorID2.lastIndexOf(":")+1) ,sensorID2.length()) ;
		  String obsPro3=null;
		  String obsPro4=null;
		  
		  try {
			IDList2 = sosClientLite.getObservedPropertyBySensorID(sensorID2);
			for(int i=0;i<IDList2.size();i++){
				s4=IDList2.get(i).getDefinition().toString();
				 s5 = IDList2.get(i).getName();
				if(s4.contains("Humidity")){
					 obsPro4=s4;
				}
				if(s5.contains("Humidity")){
					 obsPro3=s5;
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
				sensorDataPair4 = sosClientLite.getObservationLatestOneObsPro("LIESMARS",sensorID2,obsPro4);
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
	          time2 =sensorDataPair4.getObservedTime().toLocalDateTime().toString();
			   String obstime2=time.replace("T"," "); 
	        String unit2;
	      try {
			sensorDataPair3 = sosClientLite.getObservationLatestOneObsPro("LIESMARS",sensorID2,obsPro4);
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
		  unit2=sensorDataPair3.getProperty().getUnit();
	  String value2=sensorDataPair3.getValue()+"  "+"%RH";
	  Double obsvalue2=(Double) sensorDataPair3.getValue();
	  
	  ///////****************************************
	  PointTimePair pointTimePair3=null;
			double x3;
			double y3;
			
			List<ObservableProperty> IDList3;
			String s7 = null;
			String s8;
			String name3;
		    String time3;
			
			ResultOneObsPro sensorDataPair5 = null;
		    ResultOneObsPro sensorDataPair6 = null;

			 try {
				pointTimePair3=sosClientLite.getSensorLatestPosition("LIESMARS",sensorID3);
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
				x3=pointTimePair3.getX();
				y3=pointTimePair3.getY();
				
			  name3=sensorID3.substring((sensorID3.lastIndexOf(":")+1) ,sensorID3.length()) ;
			  String obsPro5=null;
			  String obsPro6=null;
			  
			  try {
				IDList3 = sosClientLite.getObservedPropertyBySensorID(sensorID3);
				for(int i=0;i<IDList3.size();i++){
					s7=IDList3.get(i).getDefinition().toString();
					 s8 = IDList3.get(i).getName();
					if(s7.contains("Humidity")){
						 obsPro6=s7;
					}
					if(s8.contains("Humidity")){
						 obsPro5=s8;
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
					sensorDataPair6 = sosClientLite.getObservationLatestOneObsPro("LIESMARS",sensorID3,obsPro6);
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
		          time3 =sensorDataPair6.getObservedTime().toLocalDateTime().toString();
				   String obstime3=time.replace("T"," "); 
		        String unit3;
		      try {
				sensorDataPair5 = sosClientLite.getObservationLatestOneObsPro("LIESMARS",sensorID3,obsPro6);
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
			  unit3=sensorDataPair5.getProperty().getUnit();
		  String value3=sensorDataPair5.getValue()+"  "+"%RH";
		  Double obsvalue3=(Double) sensorDataPair5.getValue();
		  ///
		  PointTimePair pointTimePair4=null;
			double x4;
			double y4;
			
			List<ObservableProperty> IDList4;
			String s9 = null;
			String s10;
			String name4;
		    String time4;
			
			ResultOneObsPro sensorDataPair7 = null;
		    ResultOneObsPro sensorDataPair8 = null;

			 try {
				pointTimePair4=sosClientLite.getSensorLatestPosition("LIESMARS",sensorID4);
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
				x4=pointTimePair4.getX();
				y4=pointTimePair4.getY();
				
			  name4=sensorID4.substring((sensorID4.lastIndexOf(":")+1) ,sensorID4.length()) ;
			  String obsPro7=null;
			  String obsPro8=null;
			  
			  try {
				IDList4 = sosClientLite.getObservedPropertyBySensorID(sensorID4);
				for(int i=0;i<IDList4.size();i++){
					s9=IDList4.get(i).getDefinition().toString();
					 s10 = IDList4.get(i).getName();
					if(s9.contains("Humidity")){
						 obsPro8=s9;
					}
					if(s10.contains("Humidity")){
						 obsPro7=s10;
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
					sensorDataPair8 = sosClientLite.getObservationLatestOneObsPro("LIESMARS",sensorID4,obsPro8);
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
		          time4 =sensorDataPair8.getObservedTime().toLocalDateTime().toString();
				   String obstime4=time.replace("T"," "); 
		        String unit4;
		      try {
				sensorDataPair7 = sosClientLite.getObservationLatestOneObsPro("LIESMARS",sensorID4,obsPro8);
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
			  unit3=sensorDataPair7.getProperty().getUnit();
		  String value4=sensorDataPair7.getValue()+"  "+"%RH";
		  Double obsvalue4=(Double) sensorDataPair7.getValue();
		  ///
		  PointTimePair pointTimePair5=null;
			double x5;
			double y5;
			String name5;
		    String time5;
		    
			List<ObservableProperty> IDList5;
			String s11 = null;
			String s12;
			
			
			ResultOneObsPro sensorDataPair9 = null;
		    ResultOneObsPro sensorDataPair10 = null;
   //获取观测时间和位置
			 try {
				pointTimePair5=sosClientLite.getSensorLatestPosition("LIESMARS",sensorID5);
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
				x5=pointTimePair5.getX();
				y5=pointTimePair5.getY();
	//获取观测			
			  name5=sensorID5.substring((sensorID5.lastIndexOf(":")+1) ,sensorID5.length()) ;
			  String obsPro9=null;
			  String obsPro10=null;
			  
			  try {
				IDList5 = sosClientLite.getObservedPropertyBySensorID(sensorID5);
				for(int i=0;i<IDList5.size();i++){
					s11=IDList5.get(i).getDefinition().toString();
					 s12 = IDList5.get(i).getName();
					if(s11.contains("Humidity")){
						 obsPro10=s11;
					}
					if(s12.contains("Humidity")){
						 obsPro9=s12;
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
					sensorDataPair10 = sosClientLite.getObservationLatestOneObsPro("LIESMARS",sensorID5,obsPro10);
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
		          time5 =sensorDataPair10.getObservedTime().toLocalDateTime().toString();
				   String obstime5=time.replace("T"," "); 
		        String unit5;
		      try {
				sensorDataPair9 = sosClientLite.getObservationLatestOneObsPro("LIESMARS",sensorID5,obsPro10);
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
			  unit5=sensorDataPair9.getProperty().getUnit();
		  String value5=sensorDataPair9.getValue()+"  "+"%RH";
		  Double obsvalue5=(Double) sensorDataPair9.getValue();
		  
		  
		  ////

	  req.setAttribute("name",name) ;
	  req.setAttribute("x",x) ;
	  req.setAttribute("y",y) ;
	  req.setAttribute("obstime",obstime) ;
	  req.setAttribute("obsPro",obsPro);
	  req.setAttribute("value",value) ;
	  req.setAttribute("obsvalue",obsvalue) ;
	  //
	  req.setAttribute("name2",name2) ;
	  req.setAttribute("x2",x2) ;
	  req.setAttribute("y2",y2) ;
	  req.setAttribute("obstime2",obstime2) ;
	  req.setAttribute("obsPro2",obsPro3);
	  req.setAttribute("value2",value2) ;
	  req.setAttribute("obsvalue2",obsvalue2) ;
	  //
	  req.setAttribute("name3",name3) ;
	  req.setAttribute("x3",x3) ;
	  req.setAttribute("y3",y3) ;
	  req.setAttribute("obstime3",obstime3) ;
	  req.setAttribute("obsPro3",obsPro3);
	  req.setAttribute("value3",value3) ;
	  req.setAttribute("obsvalue3",obsvalue3) ;
	  //
	  req.setAttribute("name4",name4) ;
	  req.setAttribute("x4",x4) ;
	  req.setAttribute("y4",y4) ;
	  req.setAttribute("obstime4",obstime4) ;
	  req.setAttribute("obsPro4",obsPro3);
	  req.setAttribute("value4",value4) ;
	  req.setAttribute("obsvalue4",obsvalue4) ;
	  ///
	  req.setAttribute("name5",name5) ;
	  req.setAttribute("x5",x5) ;
	  req.setAttribute("y5",y5) ;
	  req.setAttribute("obstime5",obstime5) ;
	  req.setAttribute("obsPro5",obsPro5);
	  req.setAttribute("value5",value5) ;
	  req.setAttribute("obsvalue5",obsvalue5) ;
	  
	  
	  
		req.getRequestDispatcher(path).forward(req,resp) ;
	}
	public void doPost(HttpServletRequest req,HttpServletResponse resp) throws ServletException,IOException{
		this.doGet(req,resp) ;
	}


}