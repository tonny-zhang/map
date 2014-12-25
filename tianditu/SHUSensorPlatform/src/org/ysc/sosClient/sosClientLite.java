package org.ysc.sosClient;
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


public class sosClientLite{
	private String url;
	private String obsString;
	private String offering;
	public sosClientLite(String url) throws MalformedURLException{
	 this.url=url;
	}
	public void setURL(String url){
		this.url=url;
	}
	public String getURL(){
		return this.url;
	}
	public void setObservation(String obsString){
		this.obsString=obsString;
	}
	public String getObservation(){
		return this.obsString;
	}
	public void setOffering(String offering){
		this.offering=offering;
	}
	public String getOffering(){
		return this.offering;
	}

	public String getSensorObservedValue(String sensorID, String sensorProperty) throws MalformedURLException {
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
				+"	<procedure>"+sensorID+"</procedure>"+"\n"
					
				+"	<observedProperty>"+sensorProperty+"</observedProperty>   "+"\n" 
					
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
						        if(value.length()>0){
						        String arr[]=value.split(";");
						        String obString=arr[arr.length-1];
						        String arr2[]=obString.split(",");
						        String time=arr2[0];
						        String obsvalue=arr2[arr2.length-1];
						        return obsvalue;	
						        }
						        else{
						        	return null;
						        }
	}
	public String getSensorObservedTime(String sensorID, String sensorProperty) throws MalformedURLException {
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
				+"	<procedure>"+sensorID+"</procedure>"+"\n"
					
				+"	<observedProperty>"+sensorProperty+"</observedProperty>   "+"\n" 
					
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
						        if(value.length()>0){
						        String arr[]=value.split(";");
						        String obString=arr[arr.length-1];
						        String arr2[]=obString.split(",");
						        String time=arr2[0];
						        String obsvalue=arr2[arr2.length-1];
						        return time;
						        }
						        else {
						        	return null;
						        }
	}
	public String getSensorLatestPosition(String sensorID, String sensorProperty) throws MalformedURLException {
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
				+"	<procedure>"+sensorID+"</procedure>"+"\n"
					
				+"	<observedProperty>"+sensorProperty+"</observedProperty>   "+"\n" 
					
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
									expr = xpath.compile("/ObservationCollection/member/Observation/featureOfInterest/SamplingPoint/position/Point/pos/text()");
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
						        if(value.length()>0){
						        String arr[]=value.split(";");
						        String obString=arr[arr.length-1];
						        String arr2[]=obString.split(",");
						        String time=arr2[0];
						        String obsvalue=arr2[arr2.length-1];
						        return obsvalue;	
						        }
						        else{
						        	return null;
						        }
	}
	public String[] getSensorPropertyBySensorId(String sensorID) throws MalformedURLException {
		// TODO Auto-generated method stub
		String urlParameters = 
				"<?xml version=\"1.0\" encoding=\"UTF-8\"?>"+"\n"
		
			+"	<DescribeSensor version=\"1.0.0\" service=\"SOS\""+"\n"
					+"		xmlns=\"http://www.opengis.net/sos/1.0\""+"\n"
							+"		xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\""+"\n"
									+"		xsi:schemaLocation=\"http://www.opengis.net/sos/1.0 http://schemas.opengis.net/sos/1.0.0/sosDescribeSensor.xsd\""+"\n"
				+"	outputFormat=\"text/xml;subtype=&quot;sensorML/1.0.1&quot;\">"+"\n"
					
				+"	<procedure>"+sensorID+"</procedure>"+"\n"
					
				+"</DescribeSensor>";
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
									expr = xpath.compile("/SensorML/member/System/outputs/OutputList/output/Quantity/attribute::definition");
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
						        String[] value = new String[nodes.getLength()];
						        for (int i = 0; i < nodes.getLength(); i++) {						        
						        	value[i]=nodes.item(i).getNodeValue();
						        }
						        return value;				        
	}
		
	
	public String[] getSensorIdListByProperty(String sensorProperty) throws MalformedURLException {
		// TODO Auto-generated method stub
		String offering=getOffering();
		String[] arr = {};
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
					
				+"	<observedProperty>"+sensorProperty+"</observedProperty>   "+"\n" 
					
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
									expr = xpath.compile("/ObservationCollection/member/Observation/procedure/attribute::href");
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
						       // StringBuilder value = new StringBuilder();
						        int size=nodes.getLength();
						        String[] arr1=new String[size];
						        for (int i = 0; i < nodes.getLength(); i++) {
						        	arr1[i]=nodes.item(i).getNodeValue();						       
						           // System.out.println(nodes.item(i).getNodeValue()); 
						        }
						        if(arr1.length>0){
						        String[] arr3= new String[arr1.length];		
								ArrayList<String> arrayList=new ArrayList<String>();
								boolean Issame = false;
								arr3[0] = arr1[0];
								int index = 1;
								for (int i=1;i<arr1.length;i++)
								{
									Issame = false;
									for(int j=0;j<index;j++)
									{				
										if (arr1[i].equals(arr3[j]))	
											Issame = true;										
									}
									
									if (!Issame)
									{
										arr3[index] = arr1[i];			
										index++;
									}
									
								}
						for(int j=0;j<arr3.length;j++){
							if(arr3[j]!=null){
								arrayList.add(arr3[j]);
							}
						}
						int arrSize=arrayList.size();
						String[] final_arr=new String[arrSize];
						for(int j=0;j<arrayList.size();j++){
							final_arr[j]=arrayList.get(j);
							//System.out.println(final_arr[j]);
							  }
						        return final_arr;	
						        }
						        else{
						        	return arr1;
						        }
	}

	public String[] getSensorIdListByPropertyAndTime(String sensorProperty,String startTime,String endTime) throws MalformedURLException {
		// TODO Auto-generated method stub
		String offering=getOffering();
		String[] arr = {};
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
				+"<eventTime>"+"\n"
				+"<ogc:TM_Equals>"+"\n"
				+"	<ogc:PropertyName>om:samplingTime</ogc:PropertyName>"+"\n"
				+"	<gml:TimePeriod>"+"\n"
				+"		<gml:beginPosition>"+startTime+"</gml:beginPosition>"+"\n"
				+"		<gml:endPosition>"+endTime+"</gml:endPosition>"+"\n"
				+"	</gml:TimePeriod>"+"\n"
				+"</ogc:TM_Equals>"+"\n"
			    +"</eventTime>"+"\n"
				+"	<observedProperty>"+sensorProperty+"</observedProperty>   "+"\n" 
	
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
									expr = xpath.compile("/ObservationCollection/member/Observation/procedure/attribute::href");
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
						       // StringBuilder value = new StringBuilder();
						        int size=nodes.getLength();
						        String[] arr1=new String[size];
						        for (int i = 0; i < nodes.getLength(); i++) {
						        	arr1[i]=nodes.item(i).getNodeValue();						       
						           // System.out.println(nodes.item(i).getNodeValue()); 
						        }
						        if(arr1.length>0){
						        String[] arr3= new String[arr1.length];		
								ArrayList<String> arrayList=new ArrayList<String>();
								boolean Issame = false;
								arr3[0] = arr1[0];
								int index = 1;
								for (int i=1;i<arr1.length;i++)
								{
									Issame = false;
									for(int j=0;j<index;j++)
									{				
										if (arr1[i].equals(arr3[j]))	
											Issame = true;										
									}
									
									if (!Issame)
									{
										arr3[index] = arr1[i];			
										index++;
									}
									
								}
						for(int j=0;j<arr3.length;j++){
							if(arr3[j]!=null){
								arrayList.add(arr3[j]);
							}
						}
						int arrSize=arrayList.size();
						String[] final_arr=new String[arrSize];
						for(int j=0;j<arrayList.size();j++){
							final_arr[j]=arrayList.get(j);
							//System.out.println(final_arr[j]);
							  }
						        return final_arr;	
								}
								else{
									return arr1;
								}
	}
	///20140426
	public String[] getSensorIdListByPropertyAndPosition(String sensorProperty,double x1,double y1,double x2,double y2) throws MalformedURLException {
		// TODO Auto-generated method stub
		String offering=getOffering();
		String[] arr = {};
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
					
				+"	<observedProperty>"+sensorProperty+"</observedProperty>   "+"\n" 
				+"<featureOfInterest>"+"\n" 
				+"<ogc:BBOX>"+"\n" 
				+"<ogc:PropertyName>urn:ogc:data:location</ogc:PropertyName>"+"\n" 
				+"<gml:Envelope srsName=\"urn:ogc:def:crs:EPSG::4326\">"+"\n" 
				+"<gml:lowerCorner>"+x1+" "+y1+"</gml:lowerCorner>"+"\n" 
				+"<gml:upperCorner>"+x2+" "+y2+"</gml:upperCorner>"+"\n" 
				+"</gml:Envelope>"+"\n"
				+"</ogc:BBOX>"+"\n" 
				+"</featureOfInterest>"+"\n" 
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
									expr = xpath.compile("/ObservationCollection/member/Observation/procedure/attribute::href");
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
						       // StringBuilder value = new StringBuilder();
						        int size=nodes.getLength();
						        String[] arr1=new String[size];
						        for (int i = 0; i < nodes.getLength(); i++) {
						        	arr1[i]=nodes.item(i).getNodeValue();						       
						           // System.out.println(nodes.item(i).getNodeValue()); 
						        }
						        if(arr1.length>0){
						        String[] arr3= new String[arr1.length];		
								ArrayList<String> arrayList=new ArrayList<String>();
								boolean Issame = false;
								arr3[0] = arr1[0];
								int index = 1;
								for (int i=1;i<arr1.length;i++)
								{
									Issame = false;
									for(int j=0;j<index;j++)
									{				
										if (arr1[i].equals(arr3[j]))	
											Issame = true;										
									}
									
									if (!Issame)
									{
										arr3[index] = arr1[i];			
										index++;
									}
									
								}
						for(int j=0;j<arr3.length;j++){
							if(arr3[j]!=null){
								arrayList.add(arr3[j]);
							}
						}
						int arrSize=arrayList.size();
						String[] final_arr=new String[arrSize];
						for(int j=0;j<arrayList.size();j++){
							final_arr[j]=arrayList.get(j);
							//System.out.println(final_arr[j]);
							  }
						        return final_arr;	
						        }
						        else{
						        	return arr1;
						        }
	}
	///////20140426
	public String[] getSensorIdListByPropertyAndPositionAndTime(String sensorProperty,double x1,double y1,double x2,double y2,String startTime,String endTime) throws MalformedURLException {
		// TODO Auto-generated method stub
		String offering=getOffering();
		String[] arr = {};
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
				
				+"<eventTime>"+"\n"
				+"<ogc:TM_Equals>"+"\n"
				+"	<ogc:PropertyName>om:samplingTime</ogc:PropertyName>"+"\n"
				+"	<gml:TimePeriod>"+"\n"
				+"		<gml:beginPosition>"+startTime+"</gml:beginPosition>"+"\n"
				+"		<gml:endPosition>"+endTime+"</gml:endPosition>"+"\n"
				+"	</gml:TimePeriod>"+"\n"
				+"</ogc:TM_Equals>"+"\n"
			    +"</eventTime>"+"\n"	
				
				+"	<observedProperty>"+sensorProperty+"</observedProperty>   "+"\n" 
				
				+"<featureOfInterest>"+"\n" 
				+"<ogc:BBOX>"+"\n" 
				+"<ogc:PropertyName>urn:ogc:data:location</ogc:PropertyName>"+"\n" 
				+"<gml:Envelope srsName=\"urn:ogc:def:crs:EPSG::4326\">"+"\n" 
				+"<gml:lowerCorner>"+x1+" "+y1+"</gml:lowerCorner>"+"\n" 
				+"<gml:upperCorner>"+x2+" "+y2+"</gml:upperCorner>"+"\n" 
				+"</gml:Envelope>"+"\n"
				+"</ogc:BBOX>"+"\n" 
				+"</featureOfInterest>"+"\n" 
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
									expr = xpath.compile("/ObservationCollection/member/Observation/procedure/attribute::href");
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
						       // StringBuilder value = new StringBuilder();
						        int size=nodes.getLength();
						        String[] arr1=new String[size];
						        for (int i = 0; i < nodes.getLength(); i++) {
						        	arr1[i]=nodes.item(i).getNodeValue();						       
						           // System.out.println(nodes.item(i).getNodeValue()); 
						        }
						        if(arr1.length>0){
						        String[] arr3= new String[arr1.length];		
								ArrayList<String> arrayList=new ArrayList<String>();
								boolean Issame = false;
								arr3[0] = arr1[0];
								int index = 1;
								for (int i=1;i<arr1.length;i++)
								{
									Issame = false;
									for(int j=0;j<index;j++)
									{				
										if (arr1[i].equals(arr3[j]))	
											Issame = true;										
									}
									
									if (!Issame)
									{
										arr3[index] = arr1[i];			
										index++;
									}
									
								}
						for(int j=0;j<arr3.length;j++){
							if(arr3[j]!=null){
								arrayList.add(arr3[j]);
							}
						}
						int arrSize=arrayList.size();
						String[] final_arr=new String[arrSize];
						for(int j=0;j<arrayList.size();j++){
							final_arr[j]=arrayList.get(j);
							//System.out.println(final_arr[j]);
							  }
						        return final_arr;	
						        }
						        else{
						        	return arr1;
						        }
	}
	public String[] getAllSensorProperty() throws MalformedURLException {
		// TODO Auto-generated method stub
		String urlParameters = 
				"<?xml version=\"1.0\" encoding=\"UTF-8\"?>"+"\n"
		+"<GetCapabilities xmlns=\"http://www.opengis.net/sos/1.0\""+"\n"
			+"xmlns:ows=\"http://www.opengis.net/ows/1.1\""+"\n"
			+"xmlns:ogc=\"http://www.opengis.net/ogc\""+"\n"
			+"xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\""+"\n"
			+"xsi:schemaLocation=\"http://www.opengis.net/sos/1.0"+"\n"
			+ "http://schemas.opengis.net/sos/1.0.0/sosGetCapabilities.xsd\""+"\n"
			+ "service=\"SOS\">"+"\n"
			
			+"<ows:AcceptVersions>"+"\n"
			+"	<ows:Version>1.0.0</ows:Version>"+"\n"
			+"</ows:AcceptVersions>"+"\n"
			
			+"<ows:Sections>	"+"\n"
				+"<ows:Section>OperationsMetadata</ows:Section>"+"\n"
			+"</ows:Sections>"+"\n"

		+"</GetCapabilities>";
				
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
									expr = xpath.compile("/Capabilities/OperationsMetadata/Operation[@name='GetFeatureOfInterestTime']/Parameter[@name='observedProperty']/AllowedValues/Value/text()");
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
							        String[] value = new String[nodes.getLength()];
							        for (int i = 0; i < nodes.getLength(); i++) {							       
							        	value[i]=nodes.item(i).getNodeValue();
							        }
							        return value;				        
		}
	public String[] getAllSensorID() throws MalformedURLException {
		// TODO Auto-generated method stub
		String urlParameters = 
				"<?xml version=\"1.0\" encoding=\"UTF-8\"?>"+"\n"
		+"<GetCapabilities xmlns=\"http://www.opengis.net/sos/1.0\""+"\n"
			+"xmlns:ows=\"http://www.opengis.net/ows/1.1\""+"\n"
			+"xmlns:ogc=\"http://www.opengis.net/ogc\""+"\n"
			+"xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\""+"\n"
			+"xsi:schemaLocation=\"http://www.opengis.net/sos/1.0"+"\n"
			+ "http://schemas.opengis.net/sos/1.0.0/sosGetCapabilities.xsd\""+"\n"
			+ "service=\"SOS\">"+"\n"
			
			+"<ows:AcceptVersions>"+"\n"
			+"	<ows:Version>1.0.0</ows:Version>"+"\n"
			+"</ows:AcceptVersions>"+"\n"
			
			+"<ows:Sections>	"+"\n"
				+"<ows:Section>OperationsMetadata</ows:Section>"+"\n"
			+"</ows:Sections>"+"\n"

		+"</GetCapabilities>";
				
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
									expr = xpath.compile("/Capabilities/OperationsMetadata/Operation[@name='InsertObservation']/Parameter[@name='AssignedSensorId']/AllowedValues/Value/text()");
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
							        String[] value = new String[nodes.getLength()];
							        for (int i = 0; i < nodes.getLength(); i++) {							       
							        	value[i]=nodes.item(i).getNodeValue();
							        }
							        return value;				        
		}
	////20140429
	public String sensorRegister(String sensorID, String[] sensorProperty, String[] unit) throws MalformedURLException {
		// TODO Auto-generated method stub
		String offering=getOffering();
		String urlParameters = 
				"<?xml version=\"1.0\" encoding=\"UTF-8\"?>"+"\n"
		+"<RegisterSensor service=\"SOS\" version=\"1.0.0\" xmlns=\"http://www.opengis.net/sos/1.0\" xmlns:swe=\"http://www.opengis.net/swe/1.0.1\" xmlns:ows=\"http://www.opengeospatial.net/ows\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:gml=\"http://www.opengis.net/gml\" xmlns:ogc=\"http://www.opengis.net/ogc\" xmlns:om=\"http://www.opengis.net/om/1.0\" xmlns:sml=\"http://www.opengis.net/sensorML/1.0.1\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.opengis.net/sos/1.0"+"\n"
		+"http://schemas.opengis.net/sos/1.0.0/sosRegisterSensor.xsd http://www.opengis.net/om/1.0 http://schemas.opengis.net/om/1.0.0/extensions/observationSpecialization_override.xsd\">"+"\n"
		+"<SensorDescription>"+"\n"
		+"<sml:SensorML version=\"1.0.1\">"+"\n"
		+"	<sml:member>"+"\n"
					+"	<sml:System xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">"+"\n"
						+"	<sml:identification>"+"\n"
						+"		<sml:IdentifierList>"+"\n"
						+"			<sml:identifier>"+"\n"
						+"				<sml:Term definition=\"urn:ogc:def:identifier:OGC:uniqueID\">"+"\n"
						+"					<sml:value>"+sensorID+"</sml:value>"+"\n"
						+"				</sml:Term>"+"\n"
						+"			</sml:identifier>"+"\n"
						+"		</sml:IdentifierList>"+"\n"
						+"	</sml:identification>"+"\n"					
						+"	<sml:outputs>"+"\n"
						+"		<sml:OutputList>";
						for (int i = 0; i < sensorProperty.length; i++) {
							urlParameters+=
						"			<sml:output name=\""+sensorProperty[i].substring((sensorProperty[i].lastIndexOf(":")+1) ,sensorProperty[i].length()) +"\">"+"\n"
		+"				<swe:Quantity definition=\""+sensorProperty[i]+"\">"+"\n"
		+"					<gml:metaDataProperty>"+"\n"
						+"						<offering>"+"\n"
						+"							<id>"+offering+"</id>"+"\n"
						+"							<name>测绘遥感信息工程实验室(上海大学)</name>"+"\n"
						+"						</offering>"+"\n"
						+"					</gml:metaDataProperty>"+"\n"
						+"					<swe:uom code=\""+unit[i]+"\"/>"+"\n"
						+"				</swe:Quantity>"+"\n"
						+"			</sml:output>";
						}
						urlParameters+=
						"		</sml:OutputList>"+"\n"
						+"	</sml:outputs>"+"\n"
						+"</sml:System>"+"\n"
					+"</sml:member>"+"\n"
				+"</sml:SensorML>"+"\n"
			+"</SensorDescription>"+"\n"
			+"<ObservationTemplate>"+"\n"
				+"<om:Observation>"+"\n"
				+"	<om:samplingTime/>"+"\n"
				+"	<om:procedure/>"+"\n"
				+"	<om:observedProperty/>"+"\n"
				+"	<om:featureOfInterest/>"+"\n"
				+"	<om:result/>"+"\n"
				+"</om:Observation>"+"\n"
			+"</ObservationTemplate>"+"\n"
		+"</RegisterSensor>";
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
//						String message;
//						if(information.indexOf("is already registered")!=-1){
//							message="<?xml version=\"1.0\" encoding=\"UTF-8?\">"+"\n"
//									+ "   <InsertSensorResponse> "+"\n"
//									+ "      <value>" +"\n"
//									+"         传感器注册失败,该传感器已注册在SOS中。"+"\n"
//									+ "      </value>"+"\n"
//									+ "</InsertSensorResponse>";
//						}else if(information.indexOf("ExceptionText")!=-1){
//							message="<?xml version=\"1.0\" encoding=\"UTF-8?\">"+"\n"
//									+ "  <InsertSensorResponse> "+"\n"
//									+ "       <value>" +"\n"
//									+"         传感器注册失败，请重新确认SensorML文档。"+"\n"
//									+ "       </value>"+"\n"
//									+ " </InsertSensorResponse>";
//							
//						}else{
//							message="<?xml version=\"1.0\" encoding=\"UTF-8?\">"+"\n"
//						            +" <InsertSensorResponse> "+"\n"
//									+ "   <value>" +"\n"
//									+"     传感器注册成功"+"\n"
//									+ "   </value>"+"\n"
//									+ " </InsertSensorResponse>";
//						}
//						return message;
						return information;
	}
	
	//2014/6/17
	public String sensorRegister(String urlParameters) throws MalformedURLException {
		// TODO Auto-generated method stub
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
	////20140504
	public String sensorDataInsert(String sensorID, String obsarea,String longtitude,String latitude,
			String[] sensorProperty, String[] unit,String[] obsvalue,String obstime) throws MalformedURLException {
		// TODO Auto-generated method stub
		String offering=getOffering();
		StringBuilder stringBuilder=new StringBuilder();
		stringBuilder.append(obstime);
		stringBuilder.append(",");
		for (int i = 0; i < obsvalue.length; i++) {
			stringBuilder.append(obsvalue[i]);
			if(i!=(obsvalue.length-1)){
				stringBuilder.append(",");
			}else{
				stringBuilder.append(";");
			}
		}
		String timevaluePair=stringBuilder.toString();
		String urlParameters=
				"<?xml version=\"1.0\" encoding=\"UTF-8\"?>"+"\n"
		+"<InsertObservation xmlns=\"http://www.opengis.net/sos/1.0\" "
		+ "xmlns:ows=\"http://www.opengis.net/ows/1.1\" "
		+ "xmlns:ogc=\"http://www.opengis.net/ogc\" "
		+ "xmlns:om=\"http://www.opengis.net/om/1.0\" "
		+ "xmlns:sos=\"http://www.opengis.net/sos/1.0\" "
		+ "xmlns:sa=\"http://www.opengis.net/sampling/1.0\" "
		+ "xmlns:gml=\"http://www.opengis.net/gml\" "
		+ "xmlns:swe=\"http://www.opengis.net/swe/1.0.1\" "
		+ "xmlns:xlink=\"http://www.w3.org/1999/xlink\" "
		+ "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" "
		+ "xsi:schemaLocation=\"http://www.opengis.net/sos/1.0 http://schemas.opengis.net/sos/1.0.0/sosInsert.xsd "
		+ "http://www.opengis.net/sampling/1.0 http://schemas.opengis.net/sampling/1.0.0/sampling.xsd "
		+ "http://www.opengis.net/om/1.0 http://schemas.opengis.net/om/1.0.0/extensions/observationSpecialization_override.xsd\""
		+ " service=\"SOS\" version=\"1.0.0\">"+"\n"
			+"<AssignedSensorId>"+sensorID+"</AssignedSensorId>"+"\n"
			+"<om:Observation>"+"\n"
			+"<om:samplingTime>"+"\n"
					+"<gml:TimeInstant>"+"\n"
						+"<gml:timePosition>"+obstime+"</gml:timePosition>"+"\n"
						+"</gml:TimeInstant>"+"\n"
						+"</om:samplingTime>"+"\n"
				+"<om:procedure xlink:href=\""+sensorID+"\"/>"+"\n"
				+"<om:observedProperty>"+"\n"
					+"<swe:CompositePhenomenon gml:id=\"cpid0\" dimension=\"1\">"+"\n"
					+"<gml:name>resultComponents</gml:name>"+"\n"
						+"<swe:component xlink:href=\"http://www.opengis.net/def/uom/ISO-8601/0/Gregorian\"/>";
		for (int i = 0; i < sensorProperty.length; i++) {
			urlParameters+=
							"<swe:component xlink:href=\""+sensorProperty[i]+"\"/>"+"\n";
		}
		urlParameters+=
							"</swe:CompositePhenomenon>"+"\n"
				+"</om:observedProperty>"+"\n"
				+"<om:featureOfInterest>"+"\n"
					+"<!-- 更改FOI，三个地方：id、name、pos -->"+"\n"
		+"<sa:SamplingPoint gml:id=\""+longtitude+" "+latitude+"\">"+"\n"
		+"	<gml:name>"+longtitude+" "+latitude+"</gml:name>"+"\n"
					+"	<sa:sampledFeature xlink:href=\"\"/>"+"\n"
					+"	<sa:position>"+"\n"
					+"		<gml:Point srsName=\"urn:ogc:def:crs:EPSG::4326\">"+"\n"
					+"			<gml:pos>"+longtitude+" "+latitude+"</gml:pos>"+"\n"
					+"		</gml:Point>"+"\n"
					+"	</sa:position>"+"\n"
					+"</sa:SamplingPoint>"+"\n"
				+"</om:featureOfInterest>"+"\n"
				+"<om:result>"+"\n"
				+"	<swe:DataArray>"+"\n"
				+"		<swe:elementCount>"+"\n"
				+"			<swe:Count>"+"\n"
				+"				<swe:value>1</swe:value>"+"\n"
				+"			</swe:Count>"+"\n"
				+"		</swe:elementCount>"+"\n"
				+"		<swe:elementType name=\"Components\">"+"\n"
				+"			<swe:DataRecord>"+"\n"
				+"				<swe:field name=\"Time\">"+"\n"
				+"					<swe:Time definition=\"http://www.opengis.net/def/uom/ISO-8601/0/Gregorian\"/>"+"\n"
		  +	"				</swe:field>";
		for (int i = 0; i < sensorProperty.length; i++) {
			urlParameters+=
					
				"				<swe:field name=\""+sensorProperty[i].substring(sensorProperty[i].lastIndexOf(":")+1)+"\">"+"\n"
				+"					<swe:Quantity definition=\""+sensorProperty[i]+"\">"+"\n"
		+"						<swe:uom code=\""+unit[i]+"\"/>"+"\n"
		+"					</swe:Quantity>"+"\n"
				+"				</swe:field>";
		}
		urlParameters+=						
				"			</swe:DataRecord>"+"\n"
				+"		</swe:elementType>"+"\n"
				+"		<swe:encoding>"+"\n"
				+"			<swe:TextBlock decimalSeparator=\".\" tokenSeparator=\",\" blockSeparator=\";\"/>"+"\n"
		+"		</swe:encoding>"+"\n"
				+"		<swe:values>"+timevaluePair+"</swe:values>"+"\n"
				+"	</swe:DataArray>"+"\n"
				+"</om:result>"+"\n"
			+"</om:Observation>"+"\n"
		+"</InsertObservation>";
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
//						String message;
//						if(information.indexOf("is already registered")!=-1){
//							message="<?xml version=\"1.0\" encoding=\"UTF-8?\">"+"\n"
//									+ "   <InsertSensorResponse> "+"\n"
//									+ "      <value>" +"\n"
//									+"         传感器注册失败,该传感器已注册在SOS中。"+"\n"
//									+ "      </value>"+"\n"
//									+ "</InsertSensorResponse>";
//						}else if(information.indexOf("ExceptionText")!=-1){
//							message="<?xml version=\"1.0\" encoding=\"UTF-8?\">"+"\n"
//									+ "  <InsertSensorResponse> "+"\n"
//									+ "       <value>" +"\n"
//									+"         传感器注册失败，请重新确认SensorML文档。"+"\n"
//									+ "       </value>"+"\n"
//									+ " </InsertSensorResponse>";
//							
//						}else{
//							message="<?xml version=\"1.0\" encoding=\"UTF-8?\">"+"\n"
//						            +" <InsertSensorResponse> "+"\n"
//									+ "   <value>" +"\n"
//									+"     传感器注册成功"+"\n"
//									+ "   </value>"+"\n"
//									+ " </InsertSensorResponse>";
//						}
//						return message;
						return information;
	}
}

