package test;


import java.util.List;

import org.viky.swe.webclient.sos.SOSClientLite;
import org.viky.swe.webclient.sos.data.ObservableProperty;
import org.viky.swe.webclient.sos.exception.NetworkException;
import org.viky.swe.webclient.sos.exception.OtherException;
import org.viky.swe.webclient.sos.exception.SensorIDAllNotExistException;


public class GetObservedPropertyBySensorID {

	public static void main(String[] args) {
		SOSClientLite sosClientLite = new SOSClientLite(
				"http://localhost:8080/SOS/sos");
		sosClientLite.setDefaultOfferingID("temperature");

		//long start = System.currentTimeMillis();
		//String s = sosClientLite
		//		.getSensorML("Sensor-10");
		//System.out.println("Time used: " + (System.currentTimeMillis() - start) + "ms.");
		//String temperature[] = {"temperature"};
		//DateTime starttime=new DateTime("2013-10-22T16:30:00+08:00");
		//DateTime endtime=new DateTime("2013-10-23T16:32:00+08:00");
		//List<String> IDList= null;
		//String url;
		try {
			//v = sosClientLite.getSensorLatestPosition("Sensor-10");
			//v = sosClientLite. getObservationNoFOI("temperature","Sensor-10",temperature, starttime,endtime);
			List<ObservableProperty> IDList;
			String s1;
			try {
				IDList = sosClientLite.getObservedPropertyBySensorID("urn:liesmars:object:feature:HumiditySensor1");
		
				
				
				for(int i=0;i<IDList.size();i++){
				s1 = IDList.get(i).getName();
				System.out.println(s1);}
			} catch (OtherException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (SensorIDAllNotExistException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			//url=sosClientLite.getSosurl();
			//System.out.println(IDList);
			//System.out.println(url);
		} catch (NetworkException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		//return IDList;
		
	}

}