package com.java.chart.bar;

import java.awt.Color;
import java.awt.Font;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

import javax.servlet.http.HttpSession;

import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.labels.StandardCategoryItemLabelGenerator;
import org.jfree.chart.plot.CategoryPlot;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.chart.renderer.category.BarRenderer3D;
import org.jfree.chart.servlet.ServletUtilities;
import org.jfree.data.category.CategoryDataset;
import org.jfree.data.category.DefaultCategoryDataset;
import org.jfree.data.general.DatasetUtilities;
import org.jfree.data.time.Day;
import org.jfree.data.time.TimeSeries;

public class BarChart2 {
	public static String genBarChart(HttpSession session) throws Exception{
			DefaultCategoryDataset dataset= new DefaultCategoryDataset(); 
			 double doubles[]=new double[20];
			 String dateString[]=new String[20];
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
//					   DateFormat from_type = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss");    
//				        DateFormat to_type = new SimpleDateFormat("yyyy-MM-dd");            
//				        Date   date= null;                                      
//				        date = from_type.parse(data1);  
//				        String str = to_type.format(date);  
				        
				       				    
				       Double double1=Double.parseDouble(data2);
				       
				       if(data1==null){
				           data1="00-00-00";
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
						 dataset.addValue(doubles[k],"温度",dateString[k] );
					 }
				 }
					 
		JFreeChart  chart= ChartFactory.createBarChart3D("温度统计图","时间", "cel", dataset,PlotOrientation.VERTICAL, true,true,true);
		CategoryPlot plot =chart.getCategoryPlot();
		BarRenderer3D renderer = new BarRenderer3D();
		renderer.setItemLabelGenerator(new StandardCategoryItemLabelGenerator());
		renderer.setItemLabelFont(new Font("黑体",Font.PLAIN,20));
		renderer.setItemLabelsVisible(true);
		renderer.setSeriesPaint(0, new Color(0, 0, 255));
		renderer.setSeriesOutlinePaint(0, Color.BLACK);
		renderer.setItemMargin(0.5);
		 renderer.setMaximumBarWidth(0.5);
		
		
		
		plot.setRenderer(renderer);
  	    String filename=ServletUtilities.saveChartAsJPEG(chart, 1400, 600, session);
		return filename;
	}

}
