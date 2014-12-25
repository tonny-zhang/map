package test;

import org.viky.swe.webclient.sos.SOSClientLite;
import org.viky.swe.webclient.sos.data.PointTimePair;
import org.viky.swe.webclient.sos.exception.NetworkException;
import org.viky.swe.webclient.sos.exception.NoResultException;
import org.viky.swe.webclient.sos.exception.OfferingIDNotExistException;
import org.viky.swe.webclient.sos.exception.OfferingIDNotSetException;
import org.viky.swe.webclient.sos.exception.OtherException;
import org.viky.swe.webclient.sos.exception.SensorIDAllNotExistException;


public class GetSensorFirstPosition {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		GetSensorFirstPosition pos=new GetSensorFirstPosition();
		pos.Do();
		
	}
   public void Do(){
	   SOSClientLite sosClientLite = new SOSClientLite(
				"http://localhost:8080/SOS/sos");
		sosClientLite.setDefaultOfferingID("LIESMARS");
	   //sosClientLite.setDefaultOfferingID("temperature");
		PointTimePair pointTimePair=null;
		try {
			//pointTimePair=sosClientLite.getSensorFirstPosition("Sensor-10");
		 pointTimePair=sosClientLite.getSensorLatestPosition("urn:liesmars:object:feature:Platform:Station:Weather:sta-a003");
				// getSensorLatestPosition("urn:liesmars:object:feature:Platform:Station:Weather:sta-a001");
			 System.out.println("SrID: "+pointTimePair.getSrID());
			 System.out.println("x: "+pointTimePair.getX());
			 System.out.println("y: "+pointTimePair.getY());
			
		} catch (OtherException e) {
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
		} catch (OfferingIDNotSetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
   }
}