package test;

import java.util.List;

import org.viky.swe.webclient.sos.SOSClientLite;
import org.viky.swe.webclient.sos.data.ObservableProperty;
import org.viky.swe.webclient.sos.data.ResultOneObsPro;
import org.viky.swe.webclient.sos.exception.NetworkException;
import org.viky.swe.webclient.sos.exception.OtherException;
import org.viky.swe.webclient.sos.exception.SensorIDAllNotExistException;


public class GetObservationFirst {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stu
	   SOSClientLite sosClientLite = new SOSClientLite(
				"http://localhost:8080/SOS/sos");
		sosClientLite.setDefaultOfferingID("LIESMARS");
	
	        List<ObservableProperty> IDList;
			try {
				
				IDList = sosClientLite.getObservedPropertyBySensorID("urn:liesmars:object:feature:Êª¶È´«¸ÐÆ÷1");
				for (int i=0;i<IDList.size();i++){
					System.out.println(IDList.get(i).getDefinition());
				}
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