package test;


import org.viky.swe.webclient.sos.SOSClientLite;
import org.viky.swe.webclient.sos.data.ResultOneObsPro;
import org.viky.swe.webclient.sos.exception.GetObservationParaNotCorrectException;
import org.viky.swe.webclient.sos.exception.NetworkException;
import org.viky.swe.webclient.sos.exception.NoResultException;
import org.viky.swe.webclient.sos.exception.ObservedPropertyAllNotExistException;
import org.viky.swe.webclient.sos.exception.OfferingIDNotExistException;
import org.viky.swe.webclient.sos.exception.OtherException;
import org.viky.swe.webclient.sos.exception.SensorIDAllNotExistException;


public class GetObservationFirstOneObsPro {

	public static void main(String[] args) {
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
		ResultOneObsPro sensorDataPair1;
		ResultOneObsPro sensorDataPair2;
		ResultOneObsPro sensorDataPair3;
		//List<String> IDList= null;
		//String off=null;
		//String[] temperature= {"urn:liesmars:def:phenomenon:LIESMARS:1.0.0:WindDirection",
		//		"urn:liesmars:def:phenomenon:LIESMARS:1.0.0:AirTemperature",
		//		"urn:liesmars:def:phenomenon:LIESMARS:1.0.0:WindSpeed"};
		//DateTime starttime=new DateTime("2010-10-22T16:30:00+08:00");
		//DateTime endtime=new DateTime("2013-10-23T16:32:00+08:00");
		try {
			sensorDataPair1 = sosClientLite.getObservationFirstOneObsPro("LIESMARS",
					"urn:liesmars:object:feature:Êª¶È´«¸ÐÆ÷1",
					"urn:liesmars:def:phenomenon:LIESMARS:1.0.0:Humidity");
			
			
			
			//		;getObservationNoFOI("LIESMARS","urn:liesmars:object:feature:Platform:Station:Weather:sta-a001",temperature, starttime,endtime);
			System.out.println(sensorDataPair1.getValue());

			
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
		} catch (ObservedPropertyAllNotExistException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		

	}

}