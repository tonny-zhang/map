package com.java.chart.line;

import java.awt.Font;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

import javax.servlet.http.HttpSession;

import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.axis.DateAxis;
import org.jfree.chart.axis.DateTickUnit;
import org.jfree.chart.labels.StandardCategoryItemLabelGenerator;
import org.jfree.chart.labels.StandardXYItemLabelGenerator;
import org.jfree.chart.plot.CategoryPlot;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.chart.plot.XYPlot;
import org.jfree.chart.renderer.category.CategoryItemRenderer;
import org.jfree.chart.renderer.category.LineAndShapeRenderer;
import org.jfree.chart.renderer.xy.XYItemRenderer;
import org.jfree.chart.renderer.xy.XYLineAndShapeRenderer;
import org.jfree.chart.servlet.ServletUtilities;
import org.jfree.data.category.DefaultCategoryDataset;

public class LineChart5 {
	public static String genLineChart(HttpSession session) throws Exception {
		double doubles[]=new double[20];
		 String dateString[]=new String[20];
		 
		 DefaultCategoryDataset linedataset = new DefaultCategoryDataset();
			
		Class.forName("org.postgresql.Driver").newInstance();
		Connection dbcon = DriverManager.getConnection("jdbc:postgresql:sos_db","postgres","gis");
		Statement st = dbcon.createStatement();
		ResultSet rt = st.executeQuery("select time_stamp,numeric_value from observation "
				+ "where procedure_id='urn:liesmars:object:feature:Platform:Station:Weather:sta-a001' "
				+ "and phenomenon_id='urn:liesmars:def:phenomenon:LIESMARS:1.0.0:WindSpeed'");
		int i=0;
		 while(rt.next())
		 { 
			 
			   String data1=rt.getString(1);
			   String data2=rt.getString(2);
//			   DateFormat from_type = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss");    
//		        DateFormat to_type = new SimpleDateFormat("yyyy-MM-dd");            
//		        Date   date= null;                                      
//		        date = from_type.parse(data1);  
//		        String str = to_type.format(date);  
		        
		       				    
		       Double double1=Double.parseDouble(data2);
		       
		       if(data1==null){
		           data1="00-00-00";
		       }
		       
		       if(double1==null){
		    	   double1=0.0;
		       }
		       
		       dateString[i]=data1;
		       doubles[i]=double1;
		       
		       i++;  
		       if(i==19){
		    	   break;
		       }
		 }     
		 for (int k=19;k>=0;k--){
			 if(doubles[k]!=0 &&dateString[k]!=null){
			   linedataset.addValue(doubles[k],"风速",dateString[k]);
			 }
		 }
		
		JFreeChart chart=ChartFactory.createLineChart("最近的观测数据", "时间","m/s", linedataset, PlotOrientation.VERTICAL, true, true, true);
		CategoryPlot plot=chart.getCategoryPlot();
		
		
		
		LineAndShapeRenderer linerenderer=(LineAndShapeRenderer) plot.getRenderer();
		linerenderer.setBaseShapesVisible(true);
		
		CategoryItemRenderer Item=plot.getRenderer();
		Item.setBaseItemLabelsVisible(true);
		//xyItem.setBasePositiveItemLabelPosition(null);
		Item.setBaseItemLabelGenerator(new StandardCategoryItemLabelGenerator());
		Item.setBaseItemLabelFont(new Font("dialog", Font.PLAIN, 12));
		plot.setRenderer(Item);
		
		
		String filename=ServletUtilities.saveChartAsPNG(chart, 1350, 600, session);
		return filename;
		
	}

}
