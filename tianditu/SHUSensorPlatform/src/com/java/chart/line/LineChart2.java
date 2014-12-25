package com.java.chart.line;

import java.awt.Font;
import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.GregorianCalendar;

import javax.servlet.http.HttpSession;

import org.apache.naming.java.javaURLContextFactory;
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
import org.jfree.data.time.Month;
import org.jfree.data.time.TimeSeries;
import org.jfree.data.time.TimeSeriesCollection;

public class LineChart2 {
	public static String genLineChart(HttpSession session) throws Exception {
	    Calendar calendar=null;
		TimeSeries timeSeries =new TimeSeries("空气湿度",Day.class);
		Class.forName("org.postgresql.Driver").newInstance();
		Connection dbcon = DriverManager.getConnection("jdbc:postgresql:sos_db","postgres","gis");
		Statement st = dbcon.createStatement();
		ResultSet rt = st.executeQuery("select numeric_value from observation "
				+ "where procedure_id='urn:liesmars:object:feature:Platform:Station:Weather:sta-a001' "
				+ "and phenomenon_id='urn:liesmars:def:phenomenon:LIESMARS:1.0.0:AirTemperature'");
		int i=0;
		 while(rt.next())
		 { 
		       String data=rt.getString(1);
		       //System.out.println(rt.getString(0));
		       Double double1=Double.parseDouble(data);
		       calendar=new GregorianCalendar();
		       int year=calendar.get(Calendar.YEAR);
		       int month=calendar.get((Calendar.YEAR)+1);
		       //int day= calendar.get(Calendar.DAY_OF_MONTH);
		       
		       timeSeries.add(new Day(i+1,month,year),double1);
		       i++;
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
		JFreeChart chart=ChartFactory.createTimeSeriesChart("最近的观测数据", "","cel", lineDataset, true, true, true);
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
