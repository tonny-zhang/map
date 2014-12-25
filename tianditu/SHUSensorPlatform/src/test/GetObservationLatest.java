package test;


import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.viky.swe.webclient.sos.SOSClientLite;
import org.viky.swe.webclient.sos.data.ObservableProperty;
import org.viky.swe.webclient.sos.data.ObservablePropertyDataPair;
import org.viky.swe.webclient.sos.data.ResultOneObsPro;
import org.viky.swe.webclient.sos.data.SensorDataPair;
import org.viky.swe.webclient.sos.data.TimeValuePair;
import org.viky.swe.webclient.sos.exception.GetObservationParaNotCorrectException;
import org.viky.swe.webclient.sos.exception.NetworkException;
import org.viky.swe.webclient.sos.exception.NoResultException;
import org.viky.swe.webclient.sos.exception.OfferingIDNotExistException;
import org.viky.swe.webclient.sos.exception.OfferingIDNotSetException;
import org.viky.swe.webclient.sos.exception.OtherException;
import org.viky.swe.webclient.sos.exception.SensorIDAllNotExistException;


public class GetObservationLatest {

	public static void main(String[] args) {
		SOSClientLite sosClientLite = new SOSClientLite(null);
		sosClientLite.setSosurl("http://localhost:8080/SOS/sos");
		sosClientLite.setDefaultOfferingID("temperature");
		String sensorID="urn:liesmars:object:feature:Platform:Station:Weather:sta-a001";
		SensorDataPair sensorDataPair=null;
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date starttime=null;
		Date endtime=null;
		String[] temperature= {"urn:liesmars:def:phenomenon:LIESMARS:1.0.0:WindDirection",
				"urn:liesmars:def:phenomenon:LIESMARS:1.0.0:AirTemperature",
				"urn:liesmars:def:phenomenon:LIESMARS:1.0.0:WindSpeed"};
		try {
			starttime = sdf.parse("2000-10-22 16:30:000");
			endtime=sdf.parse("2013-10-22 16:30:000");
		} catch (ParseException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		
		//List<String> IDList= null;
		//String off=null;
		
		try {
			sensorDataPair=sosClientLite.getObservationLatest(sensorID);
			for(int i=0;i<sensorDataPair.getObservedPropertyDataPairList().size();i++){
				ObservablePropertyDataPair observablePropertyDataPair=sensorDataPair.getObservedPropertyDataPairList().get(i);
				System.out.println(observablePropertyDataPair.getObservableProperty().getName());
				for(TimeValuePair timeValuePair:observablePropertyDataPair.getTimeValuePairList()){
					System.out.println("Time: "+timeValuePair.getObservedTime());
					System.out.println("Value: "+timeValuePair.getValue());
				}
			}
			
			
			
			
			
		} catch (OtherException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (OfferingIDNotExistException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SensorIDAllNotExistException e) {
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
		} catch (OfferingIDNotSetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

}
}