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
public class CopyOfAllWindSpeedSensorServlet extends HttpServlet {
	public void doGet(HttpServletRequest req,HttpServletResponse resp) throws ServletException,IOException{
		String path = "windspeed-test-demo.jsp" ;
		String sensorID1 = "urn:liesmars:object:feature:WindSpeedSensor1";
		String sensorID2 = "urn:liesmars:object:feature:WindSpeedSensor2";
		String sensorID3 = "urn:liesmars:object:feature:WindSpeedSensor3";
		SOSClientLite sosClientLite = new SOSClientLite(
				"http://localhost:8080/SOS/sos");
		PointTimePair pointTimePair=null;
		double x;
		double y;
		
		List<ObservableProperty> IDList;
		String s1 = null;
		String s2;
	    String s3;
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
				if(s1.contains("WindSpeed")){
					 obsPro2=s1;
				}
				if(s2.contains("WindSpeed")){
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
	  String value=sensorDataPair1.getValue()+"  "+unit;
	  Double obsvalue=(Double) sensorDataPair1.getValue();
	  
	  //ÐÞ¸Ä
	  
	  PointTimePair pointTimePair2=null;
		double x2;
		double y2;
		
		List<ObservableProperty> IDList2;
		String s4 = null;
		String s5;
	    String s6;
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
				if(s4.contains("WindSpeed")){
					 obsPro4=s4;
				}
				if(s5.contains("WindSpeed")){
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
	  String value2=sensorDataPair3.getValue()+"  "+unit;
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
					if(s7.contains("WindSpeed")){
						 obsPro6=s7;
					}
					if(s8.contains("WindSpeed")){
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
		  String value3=sensorDataPair5.getValue()+"  "+unit;
		  Double obsvalue3=(Double) sensorDataPair5.getValue();
		  
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
	  
	  
		req.getRequestDispatcher(path).forward(req,resp) ;
	}
	public void doPost(HttpServletRequest req,HttpServletResponse resp) throws ServletException,IOException{
		this.doGet(req,resp) ;
	}


}