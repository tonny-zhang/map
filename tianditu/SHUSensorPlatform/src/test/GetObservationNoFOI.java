package test;


import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import net.opengis.swe.x101.TimeValueList;

import org.joda.time.DateTime;
import org.viky.swe.webclient.sos.SOSClientLite;
import org.viky.swe.webclient.sos.data.ObservableProperty;
import org.viky.swe.webclient.sos.data.ObservablePropertyDataPair;
import org.viky.swe.webclient.sos.data.SensorDataPair;
import org.viky.swe.webclient.sos.data.TimeValuePair;
import org.viky.swe.webclient.sos.exception.GetObservationParaNotCorrectException;
import org.viky.swe.webclient.sos.exception.NetworkException;
import org.viky.swe.webclient.sos.exception.NoResultException;
import org.viky.swe.webclient.sos.exception.ObservedPropertyAllNotExistException;
import org.viky.swe.webclient.sos.exception.OfferingIDNotExistException;
import org.viky.swe.webclient.sos.exception.OtherException;
import org.viky.swe.webclient.sos.exception.SensorIDAllNotExistException;


public class GetObservationNoFOI {

	public static void main(String[] args) {
		//SOSClientLite sosClientLite = new SOSClientLite(
		//		"http://localhost:8080/52nSOSv3/sos");
		SOSClientLite sosClientLite = new SOSClientLite(null);
		sosClientLite.setSosurl("http://localhost:8080/SOS/sos");
		sosClientLite.setDefaultOfferingID("temperature");

		//long start = System.currentTimeMillis();
		//String s = sosClientLite
		//		.getSensorML("Sensor-10");
		//System.out.println("Time used: " + (System.currentTimeMillis() - start) + "ms.");
		//PointTimePair v=sosClientLite.getSensorLatestPosition("Sensor-10");
		//List<ObservableProperty>v= sosClientLite.getObservedPropertyBySensorID("Sensor-10");
		// Offering v=sosClientLite.getOffering("Sensor-10");
		//String v= sosClientLite.getSosurl();
		//String v= sosClientLite.getDefaultOfferingID();
		String sensorID="urn:liesmars:object:feature:Êª¶È´«¸ÐÆ÷1";
		SensorDataPair sensorDataPair=null;
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date starttime=null;
		Date endtime=null;
		String[] temperature= {"urn:liesmars:def:phenomenon:LIESMARS:1.0.0:WindDirection",
				"urn:liesmars:def:phenomenon:LIESMARS:1.0.0:AirTemperature",
				"urn:liesmars:def:phenomenon:LIESMARS:1.0.0:WindSpeed"};
		try {
			starttime = sdf.parse("2011-10-22 16:30:000");
			endtime=sdf.parse("2014-12-22 16:30:000");
		} catch (ParseException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		
		//List<String> IDList= null;
		//String off=null;
		
		
		try {
			sensorDataPair = sosClientLite.getObservationNoFOI("LIESMARS",sensorID,
					null,new DateTime(starttime),new DateTime(endtime));
			//sensorDataPair.getObservedPropertyDataPairList().get(0).getObservableProperty().setOfferingName("LIESMARS");
			//System.out.println(sensorDataPair.getObservedPropertyDataPairList().get(0).getObservableProperty().getOfferingName());
			System.out.println("sensorid: "+sensorDataPair.getSensorID());
			for(int i=0;i<sensorDataPair.getObservedPropertyDataPairList().size();i++){
				ObservablePropertyDataPair observablePropertyDataPair=sensorDataPair.getObservedPropertyDataPairList().get(i);
				System.out.println(observablePropertyDataPair.getObservableProperty().getDefinition());
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
		} catch (ObservedPropertyAllNotExistException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (GetObservationParaNotCorrectException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		

	}

}