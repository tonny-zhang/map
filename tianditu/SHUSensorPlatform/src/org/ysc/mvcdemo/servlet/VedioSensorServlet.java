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
public class VedioSensorServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 8057309876740995724L;
	public void doGet(HttpServletRequest req,HttpServletResponse resp) throws ServletException,IOException{
		String path = "Ajax-Data-vedio.jsp" ;
		String sensorID = req.getParameter("sensorID");
		SOSClientLite sosClientLite = new SOSClientLite(
				"http://localhost:84/SOS/sos");
		sosClientLite.setDefaultOfferingID("LIESMARS");
		PointTimePair pointTimePair=null;
		double x;
		double y;
		
		
		
		String name;
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
     
	  req.setAttribute("name",name) ;
	  req.setAttribute("x",x) ;
	  req.setAttribute("y",y) ;
	  req.setAttribute("sensorID",sensorID) ;
	  
		req.getRequestDispatcher(path).forward(req,resp) ;
	}
	public void doPost(HttpServletRequest req,HttpServletResponse resp) throws ServletException,IOException{
		this.doGet(req,resp) ;
	}


}