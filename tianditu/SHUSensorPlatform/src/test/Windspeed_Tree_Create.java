package test;

import java.net.MalformedURLException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;

import ysc.SOSCLient.SOSClientLite;

public class Windspeed_Tree_Create {

	public static void main(String[] args) throws MalformedURLException, InstantiationException, IllegalAccessException, ClassNotFoundException {
		SOSClientLite sosClientLite=new SOSClientLite("http://localhost:8080/SOS/sos");
		sosClientLite.setOffering("LIESMARS");
	/*	String infoString=sosClientLite.getSensorObservedValue("urn:liesmars:object:feature:Platform:Station:Weather:sta-a001",
				"urn:liesmars:def:phenomenon:LIESMARS:1.0.0:WindDirection");
		String infoString2=sosClientLite.getSensorObservedTime("urn:liesmars:object:feature:Platform:Station:Weather:sta-a001",
				"urn:liesmars:def:phenomenon:LIESMARS:1.0.0:WindDirection");
		String infoString3=sosClientLite.getSensorLatestPosition("urn:liesmars:object:feature:Platform:Station:Weather:sta-a001",
			"urn:liesmars:def:phenomenon:LIESMARS:1.0.0:WindDirection");
	*/	
		String[] arr2=sosClientLite.getSensorIdListByProperty("urn:liesmars:def:phenomenon:LIESMARS:1.0.0:WindSpeed");
		//System.out.println(infoString);
		//System.out.println(infoString2);
		//System.out.println(infoString3);
		//String[] arr2=arr.split("\n");
//		for(int i=0;i<arr2.length;i++){
//			System.out.println(arr2[i]);
//			String infoString=sosClientLite.getSensorObservedValue(arr2[i],
//					"urn:liesmars:def:phenomenon:LIESMARS:1.0.0:Temperature");
//			String infoString2=sosClientLite.getSensorObservedTime(arr2[i],
//					"urn:liesmars:def:phenomenon:LIESMARS:1.0.0:Temperature");
//			String infoString3=sosClientLite.getSensorLatestPosition(arr2[i],
//				"urn:liesmars:def:phenomenon:LIESMARS:1.0.0:Temperature");
//			
//			System.out.println(infoString);
//			System.out.println(infoString2);
//			System.out.println(infoString3);
//			
//		}
		try {
			Class.forName("org.postgresql.Driver").newInstance();
		 Connection dbcon = null;
			dbcon = DriverManager.getConnection("jdbc:postgresql:EnterChecked","postgres","gis");
			Statement st1 = dbcon.createStatement();
			int rt1=st1.executeUpdate("delete from windspeedtree");
//			PreparedStatement ps = dbcon.prepareStatement("INSERT INTO tree5(id, pid, name, url, target, sensorname)VALUES (?, ?, ?,?,?, ?)");
//			ps.setInt(1, 1);
//			ps.setInt(2, 0);
//			ps.setString(3, "Êª¶È´«¸ÐÆ÷");
//			ps.setString(4, "");
//			ps.setString(5, "index_main");
//			ps.setString(6, "");
//			int rt=ps.executeUpdate();
			PreparedStatement st = dbcon.prepareStatement("INSERT INTO windspeedtree(id, pid, name, url, target, sensorname)VALUES (?, ?, ?,?,?, ?)");
			for(int i=1;i<=arr2.length;i++){
				
				st.setInt(1, i);
				st.setInt(2, 0);
				st.setString(3, arr2[i-1]);
				st.setString(4, "WindSpeedSensorServlet?sensorID="+arr2[i-1]);
				st.setString(5, "index_main");
				st.setString(6, arr2[i-1]);
			// ResultSet rt = st.executeQuery("INSERT INTO tree4(id, pid, name, url, target, sensorname)VALUES (1, 1, arr2[i], arr2[i], index_main, arr2[i]);");
			int rt2 = st.executeUpdate();
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	  }
	}

