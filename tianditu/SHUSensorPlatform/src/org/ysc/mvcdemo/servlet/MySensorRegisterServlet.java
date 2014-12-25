package org.ysc.mvcdemo.servlet ;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.ysc.sosClient.sosClientLite;
public class MySensorRegisterServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	public void doGet(HttpServletRequest req,HttpServletResponse resp) throws ServletException,IOException{
		String path = "success.jsp" ;
			
		String Sensor_Description=(String)req.getParameter("Sensor_Description");
		String longname=(String)req.getParameter("longname");
		String shortname=(String)req.getParameter("shortname");
		String sensorDefinition=(String)req.getParameter("sensorDefinition");
		String keyword=(String)req.getParameter("keyword");
		String length=(String)req.getParameter("length");
		String width=(String)req.getParameter("width");
		String height=(String)req.getParameter("height");
		String quality=(String)req.getParameter("quality");
		//String fromtime=(String)req.getParameter("fromtime");
		//String totime=(String)req.getParameter("totime");
		String currency=(String)req.getParameter("currency");
		String defencelevel=(String)req.getParameter("defencelevel");
		String communication=(String)req.getParameter("communication");
		String fromhumidity=(String)req.getParameter("fromhumidity");
		String endhumidity=(String)req.getParameter("endhumidity");
		String fromtemp=(String)req.getParameter("fromtemp");
		String endtemp=(String)req.getParameter("endtemp");
		//String fromvolt=(String)req.getParameter("fromvolt");
		//String endvolt=(String)req.getParameter("endvolt");
		String longtitude=(String)req.getParameter("longtitude");
		String latitude=(String)req.getParameter("latitude");
		String altitude=(String)req.getParameter("altitude");
		
			String fromrange=(String)req.getParameter("fromrange");
			String endrange=(String)req.getParameter("endrange");
			
			String resolutionratio=(String)req.getParameter("resolutionratio");
			
			String interval=(String)req.getParameter("interval");
		
			String bottomrightX=(String)req.getParameter("bottomrightX");
			String bottomrightY=(String)req.getParameter("bottomrightY");
			String topleftX=(String)req.getParameter("topleftX");
			String topleftY=(String)req.getParameter("topleftY");
			String starttime=(String)req.getParameter("starttime");
			String endtime=(String)req.getParameter("endtime");
			String sensortype=(String)req.getParameter("sensortype");
			String intendApplication=(String)req.getParameter("intendApplication");
		
	
		    
		    String serviceName=(String)req.getParameter("serviceName");
			String serviceType=(String)req.getParameter("serviceType");
			String serviceAddress=(String)req.getParameter("serviceAddress");
			String sensorID=(String)req.getParameter("sensorID");
			String inputName=(String)req.getParameter("inputName");
			String inputDefinition=(String)req.getParameter("inputDefinition");
			String outputName=(String)req.getParameter("outputName");
			String outputDefinition=(String)req.getParameter("outputDefinition");
			String componentName=(String)req.getParameter("componentName");
			String componentLink=(String)req.getParameter("componentLink");

			//String contactUnit=(String)req.getParameter("contactUnit");
			String organizer=(String)req.getParameter("organizer");
			//String personalname=(String)req.getParameter("personalname");
			String telnumber=(String)req.getParameter("telnumber");
			String fax=(String)req.getParameter("fax");
			String address=(String)req.getParameter("address");
			String city=(String)req.getParameter("city");
			//String region=(String)req.getParameter("region");
			String country=(String)req.getParameter("country");
			//String zipcode=(String)req.getParameter("zipcode");
			String email=(String)req.getParameter("email");
			
			String urlParameters= 
					"<?xml version=\"1.0\" encoding=\"UTF-8\"?>"+"\n"
				+"<RegisterSensor service=\"SOS\" version=\"1.0.0\" xmlns=\"http://www.opengis.net/sos/1.0\" xmlns:swe=\"http://www.opengis.net/swe/1.0.1\" xmlns:ows=\"http://www.opengeospatial.net/ows\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:gml=\"http://www.opengis.net/gml\" xmlns:ogc=\"http://www.opengis.net/ogc\" xmlns:om=\"http://www.opengis.net/om/1.0\" xmlns:sml=\"http://www.opengis.net/sensorML/1.0.1\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.opengis.net/sos/1.0"+"\n"
				+"http://schemas.opengis.net/sos/1.0.0/sosRegisterSensor.xsd http://www.opengis.net/om/1.0 http://schemas.opengis.net/om/1.0.0/extensions/observationSpecialization_override.xsd\">"+"\n"
				+"	    <SensorDescription>"+"\n"
				+"	        <SensorML version=\"1.0.1\" xsi:schemaLocation=\"http://www.opengis.net/sensorML/1.0.1 http://schemas.opengis.net/sensorML/1.0.1/sensorML.xsd\" xmlns=\"http://www.opengis.net/sensorML/1.0.1\" xmlns:sml=\"http://www.opengis.net/sensorML/1.0.1\" xmlns:gml=\"http://www.opengis.net/gml\" xmlns:swe=\"http://www.opengis.net/swe/1.0.1\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">"+"\n"
				+"	  <sml:member>"+"\n"
				+"	    <sml:System gml:id=\"InsituSensor\">"+"\n"
				+"	      <gml:description> "+Sensor_Description+"</gml:description>"+"\n"
				+"	      <gml:name>地面原位传感器</gml:name>"+"\n"
				+"	      <sml:keywords>"+"\n"
				+"	        <sml:KeywordList>"+"\n"
				+"	          <sml:keyword>"+keyword+"</sml:keyword>"+"\n"
				+"	        </sml:KeywordList>"+"\n"
				+"	      </sml:keywords>"+"\n"
				+"		      <sml:identification>"+"\n"
				+"		        <sml:IdentifierList>"+"\n"
				+"		          <sml:identifier name=\"标识码\">"+"\n"
				+"		            <sml:Term definition=\"urn:ogc:def:identifier:OGC:1.0:uniqueID\">"+"\n"
				+"		              <sml:value>"+sensorDefinition+"</sml:value>"+"\n"
				+"		            </sml:Term>"+"\n"
				+"		          </sml:identifier>"+"\n"
				+"		          <sml:identifier name=\"全称\">"+"\n"
				+"		            <sml:Term definition=\"urn:ogc:def:identifier:OGC:1.0:longName\">"+"\n"
				+"		              <sml:value>"+longname+"</sml:value>"+"\n"
				+"		            </sml:Term>"+"\n"
				+"		          </sml:identifier>"+"\n"
				+"		          <sml:identifier name=\"简称\">"+"\n"
				+"		            <sml:Term definition=\"urn:ogc:def:identifier:OGC:1.0:shortName\">"+"\n"
				+"		              <sml:value>"+shortname+"</sml:value>"+"\n"
				+"		            </sml:Term>"+"\n"
				+"		          </sml:identifier>"+"\n"
				+"	        </sml:IdentifierList>"+"\n"
				+"	      </sml:identification>"+"\n"
				+"	      <sml:classification>"+"\n"
				+"	        <sml:ClassifierList>"+"\n"
				+"	          <sml:classifier name=\"传感器类型\">"+"\n"
				+"	            <sml:Term definition=\"urn:ogc:def:classifier:OGC:1.0:sensorType\">"+"\n"
				+"	              <sml:value>"+sensortype+"</sml:value>"+"\n"
				+"		            </sml:Term>"+"\n"
				+"		          </sml:classifier>"+"\n"
				+"		          <sml:classifier name=\"预期应用\">"+"\n"
				+"		            <sml:Term definition=\"urn:ogc:def:classifier:OGC:1.0:intendedApplication\">"+"\n"
				+"		              <sml:value>"+intendApplication+"</sml:value>"+"\n"
				+"		            </sml:Term>"+"\n"
				+"		          </sml:classifier>"+"\n"
				+"		        </sml:ClassifierList>"+"\n"
				+"		      </sml:classification>"+"\n"
				+"	      <sml:validTime>"+"\n"
				+"	        <gml:TimePeriod gml:id=\"站点平台有效时间\">"+"\n"
				+"	          <gml:beginPosition>"+starttime+"</gml:beginPosition>"+"\n"
				+"	          <gml:endPosition >"+endtime+"</gml:endPosition>"+"\n"
				+"	        </gml:TimePeriod>"+"\n"
				+"	      </sml:validTime>"+"\n"
				+"	      <!--  传感器特征==>物理特征  -->"+"\n"
				+"	      <sml:characteristics>"+"\n"
				+"	        <swe:DataRecord definition=\"urn:ogc:def:property:Shusiv:physicalProperties\">";
					
			if(length == null || length.equals("")){
				
			}else{
					urlParameters+=
				"	          <swe:field name=\"长度\">"+"\n"
				+"	            <swe:Quantity definition=\"urn:ogc:def:property:length\">"+"\n"
				+"	              <swe:uom code=\"m\" />"+"\n"
				+"	              <swe:value>"+length+"</swe:value>"+"\n"
				+"	            </swe:Quantity>"+"\n"
				+"	          </swe:field>";
			}

            if(width == null || width.equals("")){
				
			}else{
					urlParameters+=
				"		          <swe:field name=\"宽度\">"+"\n"
				+"		            <swe:Quantity definition=\"urn:ogc:def:property:width\">"+"\n"
				+"		              <swe:uom code=\"m\" />"+"\n"
				+"		              <swe:value>"+width+"</swe:value>"+"\n"
				+"		            </swe:Quantity>"+"\n"
				+"		          </swe:field>";
				}
				if(height!=" "){
					urlParameters+=
				"		          <swe:field name=\"高度\">"+"\n"
				+"		            <swe:Quantity definition=\"urn:ogc:def:property:height\">"+"\n"
				+"		              <swe:uom code=\"m\" />"+"\n"
				+"		              <swe:value>"+height+"</swe:value>"+"\n"
				+"		            </swe:Quantity>"+"\n"
				+"		          </swe:field>";
				}
				if(quality!=" "){
					urlParameters+=
				"		          <swe:field name=\"质量\">"+"\n"
				+"		            <swe:Quantity definition=\"urn:ogc:def:property:weight\">"+"\n"
				+"		              <swe:uom code=\"kg\" />"+"\n"
				+"		              <swe:value>"+quality+"</swe:value>"+"\n"
				+"		            </swe:Quantity>"+"\n"
				+"		          </swe:field>";
				}
				urlParameters+=
				"	          <swe:field name=\"电源类型\">"+"\n"
				+"	            <swe:Category definition=\"urn:ogc:def:property:powerType\">"+"\n"
				+"	              <swe:value>直流电源</swe:value>"+"\n"
				+"	            </swe:Category>"+"\n"
				+"	          </swe:field>";
				if(currency!=" "){
					urlParameters+=
				"	          <swe:field name=\"电流\">"+"\n"
				+"	            <swe:Quantity definition=\"urn:ogc:def:property:current\">"+"\n"
				+"	              <swe:uom code=\"A\" />"+"\n"
				+"	              <swe:value>"+currency+"</swe:value>"+"\n"
				+"	            </swe:Quantity>"+"\n"
				+"	          </swe:field> ";
				}
			/*	if(fromvolt == null || fromvolt.equals("")){}
				else{
					urlParameters+=
				"	          <swe:field name=\"电压\">"+"\n"
				+"	            <swe:Quantity definition=\"urn:ogc:def:property:voltage\">"+"\n"
				+"	              <swe:uom code=\"V\" />"+"\n"
				+"	              <swe:value>"+fromvolt+" "+endvolt+"</swe:value>"+"\n"
				+"	            </swe:Quantity>"+"\n"
				+"	          </swe:field> ";
				}
				*/	    
				if(fromtemp!=" "&&fromtemp!=" "){
					urlParameters+=
				"		          <swe:field name=\"工作温度范围\">"+"\n"
				+"		            <swe:QuantityRange definition=\"urn:ogc:def:property:operatingTemperature\">"+"\n"
				+"		              <swe:uom code=\"cel\" />"+"\n"
				+"		              <swe:value>"+fromtemp+" "+endtemp+"</swe:value>"+"\n"
				+"		            </swe:QuantityRange>"+"\n"
				+"		          </swe:field>";
				}
				if(fromhumidity!=" "&&endhumidity!=" "){
					urlParameters+=
				"		          <swe:field name=\"工作湿度范围\">"+"\n"
				+"		            <swe:QuantityRange definition=\"urn:ogc:def:property:operatingHumidity\">"+"\n"
				+"		              <swe:uom code=\"%\" />"+"\n"
				+"		              <swe:value>"+fromhumidity+" "+endhumidity+"</swe:value>"+"\n"
				+"		            </swe:QuantityRange>"+"\n"
				+"		          </swe:field>";
				}
				if(defencelevel!=" "){
					urlParameters+=
				"		          <swe:field name=\"防护等级\">"+"\n"
				+"		            <swe:Text definition=\"urn:ogc:def:property:protectionGrade\">"+"\n"
				+"		              <swe:value>"+defencelevel+"</swe:value>"+"\n"
				+"		            </swe:Text>"+"\n"
				+"		          </swe:field>";
				}
				
				if(communication!=" "){
					urlParameters+=
				"		          <swe:field name=\"协议类型\">"+"\n"
				+"		            <swe:Category definition=\"urn:ogc:def:property:protocolType\">"+"\n"
				+"		              <swe:value>"+communication+"</swe:value>"+"\n"
				+"		            </swe:Category>"+"\n"
				+"		          </swe:field>	";
				}

				urlParameters+=
				"		        </swe:DataRecord>"+"\n"
				+"		      </sml:characteristics>"+"\n"
				+"		      <!--  传感器能力特征==>观测能力  -->"+"\n"
				+"		      <sml:capabilities>"+"\n"
				+"		        <swe:DataRecord definition=\"urn:ogc:def:property:Shusiv:measurementCapabilities\">"+"\n"
				+"		          <!--  传感器观测能力==>观测广度  -->"+"\n"
				+"		          <swe:field name=\"observedBBOX\">"+"\n"
				+"		            <swe:Envelope definition=\"urn:ogc:def:property:OGC:1.0:observedBBO\" referenceFrame=\"urn:ogc:def:crs:EPSG:4326\">"+"\n"
				+"		              <swe:lowerCorner>"+"\n"
				+"		                <swe:Vector>"+"\n"
				+"		                  <swe:coordinate name=\"纬度\">"+"\n"
				+"		                    <swe:Quantity axisID=\"y\">"+"\n"
				+"		                      <swe:uom code=\"deg\" xlink:href=\"urn:ogc:def:uom:UCUM::deg\" />"+"\n"
				+"		                      <swe:value>"+bottomrightY+"</swe:value>"+"\n"
				+"		                    </swe:Quantity>"+"\n"
				+"		                  </swe:coordinate>"+"\n"
				+"		                  <swe:coordinate name=\"经度\">"+"\n"
				+"		                    <swe:Quantity axisID=\"x\">"+"\n"
				+"		                      <swe:uom code=\"deg\" xlink:href=\"urn:ogc:def:uom:UCUM::deg\" />"+"\n"
				+"		                      <swe:value>"+bottomrightX+"</swe:value>"+"\n"
				+"		                    </swe:Quantity>"+"\n"
				+"		                  </swe:coordinate>"+"\n"
				+"		                </swe:Vector>"+"\n"
				+"		              </swe:lowerCorner>"+"\n"
				+"		              <swe:upperCorner>"+"\n"
				+"		                <swe:Vector>"+"\n"
				+"		                  <swe:coordinate name=\"纬度\">"+"\n"
				+"		                    <swe:Quantity axisID=\"y\">"+"\n"
				+"		                      <swe:uom code=\"deg\" xlink:href=\"urn:ogc:def:uom:UCUM::deg\" />"+"\n"
				+"		                      <swe:value>"+topleftY+"</swe:value>"+"\n"
				+"		                    </swe:Quantity>"+"\n"
				+"		                  </swe:coordinate>"+"\n"
				+"		                  <swe:coordinate name=\"经度\">"+"\n"
				+"		                    <swe:Quantity axisID=\"x\">"+"\n"
				+"		                      <swe:uom code=\"deg\" xlink:href=\"urn:ogc:def:uom:UCUM::deg\" />"+"\n"
				+"		                      <swe:value>"+topleftX+"</swe:value>"+"\n"
				+"		                    </swe:Quantity>"+"\n"
				+"		                  </swe:coordinate>"+"\n"
				+"		                </swe:Vector>"+"\n"
				+"		              </swe:upperCorner>"+"\n"
				+"		            </swe:Envelope>"+"\n"
				+"		          </swe:field>";
				if(fromrange!=" "&&endrange!=" "){
					urlParameters+=
				"		          <swe:field name=\"量程范围\">"+"\n"
				+"		            <swe:QuantityRange definition=\"urn:ogc:def:property:measurementRange\">"+"\n"
				+"		              <swe:uom code=\"°\" />"+"\n"
				+"		              <swe:value>"+fromrange+" "+endrange+"</swe:value>"+"\n"
				+"		            </swe:QuantityRange>"+"\n"
				+"		          </swe:field>";
				}
				if(resolutionratio!=" "){
					urlParameters+=
				"		          <!--  传感器观测能力==>观测深度  -->"+"\n"
				+"		          <swe:field name=\"观测分辨率\">"+"\n"
				+"		            <swe:Quantity definition=\"urn:ogc:def:property:measurementResolution\">"+"\n"
				+"		              <swe:uom code=\"°\"/>"+"\n"
				+"		              <swe:value>"+resolutionratio+"</swe:value>"+"\n"
				+"		            </swe:Quantity>"+"\n"
				+"		          </swe:field>";
				}
				if(interval!=" "){
					urlParameters+=
				"				  <!--  传感器观测能力==>观测频度  -->"+"\n"
				+"		          <swe:field name=\"观测周期\">"+"\n"
				+"		            <swe:Quantity definition=\"urn:ogc:def:property:measurementInterval\">"+"\n"
				+"		              <swe:uom code=\"s\"/>"+"\n"
				+"		              <swe:value>"+interval+"</swe:value>"+"\n"
				+"		            </swe:Quantity>"+"\n"
				+"		          </swe:field>";
				}
				urlParameters+=
				"		        </swe:DataRecord>"+"\n"
				+"		      </sml:capabilities>"+"\n"
						
+"		      <!--  平台互操作服务==>联系单位  -->"+"\n"
+"		      <sml:contact xlink:arcrole=\"urn:ogc:def:role:operator\">"+"\n"
+"		        <sml:ResponsibleParty>";
				if(organizer == null || organizer.equals("")){
					
				}else{
	urlParameters+=
"		          <sml:organizationName>"+organizer+"</sml:organizationName>";
}
urlParameters+=
"		          <sml:contactInfo>";
if(telnumber == null || telnumber.equals("")){	
}else{
	urlParameters+=
"		            <sml:phone>"+"\n"
+"		              <sml:voice>"+telnumber+"</sml:voice>"+"\n"
+"		            </sml:phone>";
}
urlParameters+="		            <sml:address>";
if(fax == null || fax.equals("")){	
}else{
	urlParameters+=
"		              <sml:deliveryPoint>"+fax+"</sml:deliveryPoint>";
}
if(address == null || address.equals("")){	
}else{
	urlParameters+=
"		              <sml:deliveryPoint>"+address+"</sml:deliveryPoint>";
}

if(city == null || city.equals("")){	
}else{
	urlParameters+=
"		              <sml:city>"+city+"</sml:city>";
}
if(country == null || country.equals("")){	
}else{
	urlParameters+=
"		              <sml:country>"+country+"</sml:country>";
}
/*
if(zipcode == null || zipcode.equals("")){	
}else{
	urlParameters+=
"		              <sml:postalCode>"+zipcode+"</sml:postalCode>";
}
*/
if(email == null || email.equals("")){	
}else{
	urlParameters+=
"		              <sml:electronicMailAddress>"+email+"</sml:electronicMailAddress>";
}
urlParameters+=
"		            </sml:address>"+"\n"
+"		          </sml:contactInfo>"+"\n"
+"		        </sml:ResponsibleParty>"+"\n"
+"		      </sml:contact>"+"\n"

				+"		      <!--  传感器定位能力  -->"+"\n"
				+"		      <sml:position name=\"传感器位\">"+"\n"
				+"		        <swe:Position fixed=\"false\" referenceFrame=\"urn:ogc:def:crs:EPSG:4329\">"+"\n"
				+"		          <swe:location>"+"\n"
				+"		            <swe:Vector definition=\"urn:ogc:def:property:OGC:location\">"+"\n"
				+"		              <swe:coordinate name=\"纬度\">"+"\n"
				+"		                <swe:Quantity axisID=\"y\" definition=\"urn:ogc:def:property:OGC:latitude\">"+"\n"
				+"		                  <swe:uom code=\"deg\" />"+"\n"
				+"		                  <swe:value>"+latitude+"</swe:value>"+"\n"
				+"		                </swe:Quantity>"+"\n"
				+"		              </swe:coordinate>"+"\n"
				+"		              <swe:coordinate name=\"经度\">"+"\n"
				+"		                <swe:Quantity axisID=\"x\" definition=\"urn:ogc:def:property:OGC:longitude\">"+"\n"
				+"		                  <swe:uom code=\"deg\" />"+"\n"
				+"		                  <swe:value>"+longtitude+"</swe:value>"+"\n"
				+"		                </swe:Quantity>"+"\n"
				+"		              </swe:coordinate>"+"\n"
				+"		              <swe:coordinate name=\"高度\">"+"\n"
				+"		                <swe:Quantity axisID=\"z\" definition=\"urn:ogc:def:property:OGC:altitude\">"+"\n"
				+"		                  <swe:uom code=\"m\" />"+"\n"
				+"		                  <swe:value>"+altitude+"</swe:value>"+"\n"
				+"		                </swe:Quantity>"+"\n"
				+"		              </swe:coordinate>"+"\n"
				+"		            </swe:Vector>"+"\n"
				+"		          </swe:location>"+"\n"
				+"		        </swe:Position>"+"\n"
				+"		      </sml:position>"+"\n"
				+"		      <!--  传感器互操作服务==>服务接口  -->"+"\n"
				+"		      <sml:interfaces>"+"\n"
				+"		        <sml:InterfaceList>"+"\n"
				+"		          <sml:interface name=\""+serviceName+"\">"+"\n"
				+"		            <sml:InterfaceDefinition>"+"\n"
				+"		              <sml:serviceLayer>"+"\n"
				+"		                <swe:DataRecord definition=\"urn:ogc:def:interface:OGC:1.0:SWEServiceInterface\">";
				if(serviceAddress!=" "){
					urlParameters+=
				"		                  <swe:field name=\"urn:ogc:def:interface:OGC:1.0:ServiceURL\">"+"\n"
				+"		                    <swe:Text>"+"\n"
				+"		                      <swe:value>"+serviceAddress+"</swe:value>"+"\n"
				+"		                    </swe:Text>"+"\n"
				+"		                  </swe:field>";
				}
				if(serviceType!=" "){
					urlParameters+=
				"		                  <swe:field name=\"urn:ogc:def:interface:OGC:1.0:ServiceType\">"+"\n"
				+"		                    <swe:Text>"+"\n"
				+"		                      <swe:value>"+serviceType+"</swe:value>"+"\n"
				+"		                    </swe:Text>"+"\n"
				+"		                  </swe:field>";
				}
				if(sensorID!=" "){
					urlParameters+=
				"		                  <swe:field name=\"urn:ogc:def:interface:OGC:1.0:ServiceSpecificSensorID\">"+"\n"
				+"		                    <swe:Text>"+"\n"
				+"		                      <swe:value>"+sensorID+"</swe:value>"+"\n"
				+"		                    </swe:Text>"+"\n"
				+"		                  </swe:field>";
				}
				urlParameters+=
				"		                </swe:DataRecord>"+"\n"
				+"		              </sml:serviceLayer>"+"\n"
				+"		            </sml:InterfaceDefinition>"+"\n"
				+"		          </sml:interface>"+"\n"
				+"		        </sml:InterfaceList>"+"\n"
				+"		      </sml:interfaces>"+"\n"
				+"		      <!--  输入输出  -->"+"\n"
				+"		      <sml:inputs>"+"\n"
				+"		        <sml:InputList>"+"\n"
				+"		          <input name=\""+inputName+"\">"+"\n"
				+"		            <swe:ObservableProperty definition=\""+inputDefinition+"\" />"+"\n"
				+"		          </input>"+"\n"
				+"		        </sml:InputList>"+"\n"
				+"		      </sml:inputs>"+"\n"
				+"		      <sml:outputs>"+"\n"
				+"		        <sml:OutputList>"+"\n"
				+"		           <output name=\""+outputName+"\">"+"\n"
				+"		            <swe:Quantity definition=\""+outputDefinition+"\">"+"\n"
				+"					  <gml:metaDataProperty>"+"\n"
				+"					 	<offering>"+"\n"
				+"						  <id>"+componentName+"</id>"+"\n"
				+"						  <name>"+componentLink+"</name>"+"\n"
				+"						</offering>"+"\n"
				+"					  </gml:metaDataProperty>"+"\n"
				+"		              <swe:uom code=\"°\" />"+"\n"
				+"		            </swe:Quantity>"+"\n"
				+"		          </output>"+"\n"
				+"		        </sml:OutputList>"+"\n"
				+"		      </sml:outputs>"+"\n"
				+"		      <!--     部件     -->"+"\n"
				+"		      <sml:components />"+"\n"
				+"		      <!--     关联    -->"+"\n"
				+"		    </sml:System>"+"\n"
				+"		  </sml:member>"+"\n"
				+"		</SensorML>"+"\n"
				+"		    </SensorDescription>"+"\n"
				+"		    <ObservationTemplate>"+"\n"
				+"		        <om:Observation>"+"\n"
				+"		            <om:samplingTime/>"+"\n"
				+"		            <om:procedure/>"+"\n"
				+"		            <om:observedProperty/>"+"\n"
				+"		            <om:featureOfInterest/>"+"\n"
				+"		            <om:result/></om:Observation>"+"\n"
				+"		    </ObservationTemplate>"+"\n"
				+"		</RegisterSensor>";
 
				//String urlParameters2= (String) req.getParameter("urlParameters");
		sosClientLite sosClientLite = new sosClientLite("http://vsisos.shu.edu.cn:84/SOS/sos");
		String info=sosClientLite.sensorRegister(urlParameters);
		req.setAttribute("info",info) ;
		   req.setAttribute("email",email);
		req.getRequestDispatcher(path).forward(req,resp) ;
	}
	public void doPost(HttpServletRequest req,HttpServletResponse resp) throws ServletException,IOException{
		this.doGet(req,resp) ;
	}


}