package ysc.SOSCLient;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.StringReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.List;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

public class TimeValuePair {
	private String obString;
	private String obsString;	
	public String getObservationValue(String string, String string2) throws MalformedURLException {
		// TODO Auto-generated method stub
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
					
				+"	<offering>LIESMARS</offering>"+"\n"
				+"	<procedure>"+string+"</procedure>"+"\n"
					
				+"	<observedProperty>"+string2+"</observedProperty>   "+"\n" 
					
				+"	<responseFormat>text/xml;subtype=&quot;om/1.0.0&quot;</responseFormat>"+"\n"

				+"</GetObservation>";
						List<String> info = new ArrayList<String>() ;	// 收集错误
						URL url = new URL("http://localhost:8080/SOS/sos");
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
						  Document doc = null;
						  String xmlStr=null;
						        try {
						              xmlStr = new String(information.getBytes(),"gb2312");
						               StringReader sr = new StringReader(xmlStr);
						            InputSource is = new InputSource(sr);
						              DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
						             DocumentBuilder builder;
						              builder = factory.newDocumentBuilder();
						              doc = builder.parse(is);
						              
						         } catch (ParserConfigurationException e) {
						              System.err.println(xmlStr);
						             // TODO Auto-generated catch block
						              e.printStackTrace();
						          } catch (SAXException e) {
						               System.err.println(xmlStr);
						               // TODO Auto-generated catch block
						               e.printStackTrace();
						          } catch (IOException e) {
						               System.err.println(xmlStr);
						              // TODO Auto-generated catch block
						              e.printStackTrace();
						           }
						//return information;
						        
						        DocumentBuilderFactory domFactory = DocumentBuilderFactory.newInstance();
						        domFactory.setNamespaceAware(true); // never forget this!
						        try {
									DocumentBuilder builder = domFactory.newDocumentBuilder();
								} catch (ParserConfigurationException e2) {
									// TODO Auto-generated catch block
									e2.printStackTrace();
								}					  

						        XPathFactory factory = XPathFactory.newInstance();
						        XPath xpath = factory.newXPath();
						        javax.xml.xpath.XPathExpression expr = null;
								try {
									expr = xpath.compile("/ObservationCollection/member/Observation/result/DataArray/values/text()");
								} catch (XPathExpressionException e1) {
									// TODO Auto-generated catch block
									e1.printStackTrace();
								}

						        Object result = null;
								try {
									result = expr.evaluate(doc, XPathConstants.NODESET);
								} catch (XPathExpressionException e) {
									// TODO Auto-generated catch block
									e.printStackTrace();
								}
						        NodeList nodes = (NodeList) result;
						        String value = null;
						        for (int i = 0; i < nodes.getLength(); i++) {
						           // System.out.println(nodes.item(i).getNodeValue()); 
						        	value=nodes.item(i).getNodeValue();
						        }
						        String[] arr=value.split(";");
						        obString=arr[arr.length-1];
						        
						        return obString;				        
	}
	public String getTime() {
		String newString=getObservation();
		String arr2[]=newString.split(",");
        String time=arr2[0];
        return time;
	}
	public void setObservation(String obsString){
		this.obsString=obsString;
	}
	public String getObservation(){
		return this.obsString;
	}
	public static void main(String[] args) throws MalformedURLException {
		TimeValuePair timeValuePair=new TimeValuePair();
		String time=timeValuePair.getObservationValue("urn:liesmars:object:feature:Platform:Station:Weather:sta-a001",
				"urn:liesmars:def:phenomenon:LIESMARS:1.0.0:WindDirection");
		System.out.println(time);
	  }
	
}
