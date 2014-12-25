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
import org.viky.swe.webclient.sos.exception.OfferingIDNotSetException;
import org.viky.swe.webclient.sos.exception.OtherException;
import org.viky.swe.webclient.sos.exception.SensorIDAllNotExistException;
public class HumiditySensorServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 8057309876740995724L;
	public void doGet(HttpServletRequest req,HttpServletResponse resp) throws ServletException,IOException{
		String path = "Ajax-Data-humidity.jsp" ;
		String sensorID = req.getParameter("sensorID");
		SOSClientLite sosClientLite = new SOSClientLite(
				"http://localhost:84/SOS/sos");
		sosClientLite.setDefaultOfferingID("LIESMARS");
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
			try {
				pointTimePair=sosClientLite.getSensorLatestPosition(sensorID);
			} catch (OfferingIDNotSetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
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
			
		  name=sensorID.substring((sensorID.lastIndexOf(":")+1) ,sensorID.length()) ;
		  String obsPro=null;
		  String obsPro2=null;
		  
		  try {
			IDList = sosClientLite.getObservedPropertyBySensorID(sensorID);
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
				sensorDataPair2 = sosClientLite.getObservationLatestOneObsPro("LIESMARS",sensorID,obsPro2);
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
			   String obstime=time.replace("T","-"); 
	        String unit;
	      try {
			sensorDataPair1 = sosClientLite.getObservationLatestOneObsPro("LIESMARS",sensorID,obsPro2);
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
	  String value=sensorDataPair1.getValue()+" "+"%RH";

	  req.setAttribute("name",name) ;
	  req.setAttribute("x",x) ;
	  req.setAttribute("y",y) ;
	  req.setAttribute("obstime",obstime) ;
	  req.setAttribute("obsPro",obsPro);
	  req.setAttribute("value",value) ;
	  req.setAttribute("sensorID", sensorID);
	  
		req.getRequestDispatcher(path).forward(req,resp) ;
	}
	public void doPost(HttpServletRequest req,HttpServletResponse resp) throws ServletException,IOException{
		this.doGet(req,resp) ;
	}


}