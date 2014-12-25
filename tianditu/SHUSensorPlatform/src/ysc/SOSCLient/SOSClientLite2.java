package ysc.SOSCLient;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.List;


public class SOSClientLite2{
	private String url;
	private String offering;
	public SOSClientLite2(String url) throws MalformedURLException{
	 this.url=url;
	}
	public void setURL(String url){
		this.url=url;
	}
	public String getURL(){
		return this.url;
	}
	public void setOffering(String offering){
		this.offering=offering;
	}
	public String getOffering(){
		return this.offering;
	}

	public String getObservation(String string, String string2) throws MalformedURLException {
		// TODO Auto-generated method stub
		String offering=getOffering();
		String urlParameters = 
				"<?xml version=\"1.0\" encoding=\"UTF-8\"?>"+"\n"
				+"<GetObservation xmlns=\"http://www.opengis.net/sos/1.0\""+"\n"
				+"xmlns:ows=\"http://www.opengis.net/ows/1.1\""+"\n"
				+"	xmlns:gml=\"http://www.opengis.net/gml\""+"\n"
				+"	xmlns:ogc=\"http://www.opengis.net/ogc\""+"\n"
				+"	xmlns:om=\"http://www.opengis.net/om/1.0\""+"\n"
				+"	xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\""+"\n"
				+"	xsi:schemaLocation=\"http://www.opengis.net/sos/1.0 http://schemas.opengis.net/sos/1.0.0/sosGetObservation.xsd\""+"\n"
				+"	service=\"SOS\" version=\"1.0.0\">"+"\n"
					
				+"	<offering>"+offering+"</offering>"+"\n"
				+"	<procedure>"+string+"</procedure>"+"\n"
					
				+"	<observedProperty>"+string2+"</observedProperty>   "+"\n" 
					
				+"	<responseFormat>text/xml;subtype=&quot;om/1.0.0&quot;</responseFormat>"+"\n"

				+"</GetObservation>";
						List<String> info = new ArrayList<String>() ;	// 收集错误
						URL url = new URL(getURL());
						URLConnection conn = null;
						try {
							conn = url.openConnection();
						} catch (IOException e) {
						// TODO Auto-generated catch block
							e.printStackTrace();
						}

						conn.setDoOutput(true);
						OutputStreamWriter writer = null;
						try {
							writer = new OutputStreamWriter(conn.getOutputStream());
						} catch (IOException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}

						try {
							writer.write(urlParameters);
						} catch (IOException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
						try {
							writer.flush();
						} catch (IOException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}

						String line;
						BufferedReader reader = null;
						try {
							reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
						} catch (IOException e1) {
							// TODO Auto-generated catch block
							e1.printStackTrace();
						}

						try {
							while ((line = reader.readLine()) != null) {
							   info.add(line);
							}
						} catch (IOException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
						try {
							writer.close();
						} catch (IOException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
						try {
							reader.close();
						} catch (IOException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
						StringBuffer sb = new StringBuffer(); 
						if(info != null){	// 有信息返回
							for (int i = 0; i < info.size(); i++) 
							{ 
								sb.append(info.get(i)); 
								sb.append("\n");
							}
						}
						String information=sb.toString();
						return information;
	}
	

}
