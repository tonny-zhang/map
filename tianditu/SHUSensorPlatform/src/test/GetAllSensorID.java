package test;


import java.util.List;

import org.viky.swe.webclient.sos.SOSClientLite;
import org.viky.swe.webclient.sos.exception.NetworkException;
import org.viky.swe.webclient.sos.exception.OtherException;
import org.viky.swe.webclient.sos.exception.SensorIDAllNotExistException;


public class GetAllSensorID {

	public static void main(String[] args) {
		SOSClientLite sosClientLite = new SOSClientLite(
				"http://localhost:8080/SOS/sos");
		sosClientLite.setDefaultOfferingID("LIESMARS");
//		try {
//			//String resp=	sosClientLite.getSensorML("urn:liesmars:object:feature:Platform:Station:Weather:sta-a001");
//		} catch (NetworkException e1) {
//			// TODO Auto-generated catch block
//			e1.printStackTrace();
//		} catch (OtherException e1) {
//			// TODO Auto-generated catch block
//			e1.printStackTrace();
//		} catch (SensorIDAllNotExistException e1) {
//			// TODO Auto-generated catch block
//			e1.printStackTrace();
//		}
		//long start = System.currentTimeMillis();
		//String s = sosClientLite
		//		.getSensorML("Sensor-10");
		//System.out.println("Time used: " + (System.currentTimeMillis() - start) + "ms.");
		//String temperature[] = {"temperature"};
		//DateTime starttime=new DateTime("2013-10-22T16:30:00+08:00");
		//DateTime endtime=new DateTime("2013-10-23T16:32:00+08:00");
		List<String> IDList= null;
		
		try {
			//v = sosClientLite.getSensorLatestPosition("Sensor-10");
			//v = sosClientLite. getObservationNoFOI("temperature","Sensor-10",temperature, starttime,endtime);
		IDList=sosClientLite.getAllSensorID();
		 for(int i=0;i<IDList.size();i++)
		 {
		 	String list=IDList.get(i);
		 	if(list.contains("urn:liesmars:insitusensor:Baoxie")){
			//String v=IDList.get(0);
			System.out.println(list);
		 	}
		 }
		} catch (NetworkException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		try {
			String resp = sosClientLite.getSensorML("urn:liesmars:object:feature:Platform:Station:Weather:sta-a001");
			System.out.println(resp);
		} catch (NetworkException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (OtherException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SensorIDAllNotExistException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	
	}

}