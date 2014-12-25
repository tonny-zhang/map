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
import org.jfree.chart.labels.StandardXYItemLabelGenerator;
import org.jfree.chart.plot.XYPlot;
import org.jfree.chart.renderer.xy.XYItemRenderer;
import org.jfree.chart.renderer.xy.XYLineAndShapeRenderer;
import org.jfree.chart.servlet.ServletUtilities;
import org.jfree.data.time.Day;
import org.jfree.data.time.TimeSeries;
import org.jfree.data.time.TimeSeriesCollection;

public class LineChart4 {
	public static String genLineChart(HttpSession session) throws Exception {
		double doubles[]=new double[20];
		TimeSeries timeSeries =new TimeSeries("风速",Day.class);
		Class.forName("org.postgresql.Driver").newInstance();
		Connection dbcon = DriverManager.getConnection("jdbc:postgresql:sos_db","postgres","gis");
		Statement st = dbcon.createStatement();
		ResultSet rt = st.executeQuery("select numeric_value from observation "
				+ "where procedure_id='urn:liesmars:object:feature:Platform:Station:Weather:sta-a001' "
				+ "and phenomenon_id='urn:liesmars:def:phenomenon:LIESMARS:1.0.0:WindSpeed'");
		int i=0;
		 while(rt.next())
		 { 
		       String data=rt.getString(1);
		       //System.out.println(rt.getString(0));
		       Double double1=Double.parseDouble(data);
		       doubles[i]=double1;
		       i++;  
		       if(i==19){
		    	   break;
		       }
		 }     
		 for (int k=19;k>=0;k--){
			 int time[]={20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1};
		       timeSeries.add(new Day(time[k],9,2012),doubles[k]);
		       
		 }
		       
		
//		timeSeries.add(new Month(1,2013),100);
//		timeSeries.add(new Month(2,2013),300);
//		timeSeries.add(new Month(3,2013),200);
//		timeSeries.add(new Month(4,2013),100);
//		timeSeries.add(new Month(5,2013),400);
//		timeSeries.add(new Month(6,2013),500);
//		timeSeries.add(new Month(7,2013),900);
//		timeSeries.add(new Month(8,2013),100);
//		timeSeries.add(new Month(9,2013),600);
//		timeSeries.add(new Month(10,2013),500);
//		timeSeries.add(new Month(11,2013),400);
//		timeSeries.add(new Month(12,2013),300);
		TimeSeriesCollection lineDataset=new TimeSeriesCollection();
		lineDataset.addSeries(timeSeries);
		JFreeChart chart=ChartFactory.createTimeSeriesChart("最近的观测数据", "","m/s", lineDataset, true, true, true);
		XYPlot plot=(XYPlot)chart.getPlot();
		DateAxis dateAxis=(DateAxis)plot.getDomainAxis();
		dateAxis.setDateFormatOverride(new java.text.SimpleDateFormat("M"));
		dateAxis.setTickUnit(new DateTickUnit(DateTickUnit.DAY, 1));
		
		XYLineAndShapeRenderer xylinerenderer=(XYLineAndShapeRenderer)plot.getRenderer();
		xylinerenderer.setBaseShapesVisible(true);
		
		XYItemRenderer xyItem=plot.getRenderer();
		xyItem.setBaseItemLabelsVisible(true);
		//xyItem.setBasePositiveItemLabelPosition(null);
		xyItem.setBaseItemLabelGenerator(new StandardXYItemLabelGenerator());
		xyItem.setBaseItemLabelFont(new Font("dialog", Font.PLAIN, 12));
		plot.setRenderer(xyItem);
		
		
		String filename=ServletUtilities.saveChartAsPNG(chart, 700, 500, session);
		return filename;
		
	}

}
