package com.java.chart.line;

import java.awt.Font;
import java.text.SimpleDateFormat;

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
import org.jfree.data.time.Month;
import org.jfree.data.time.TimeSeries;
import org.jfree.data.time.TimeSeriesCollection;

public class LineChart1 {
	public static String genLineChart(HttpSession session) throws Exception {
		TimeSeries timeSeries =new TimeSeries("网站访问量",Month.class);
		timeSeries.add(new Month(1,2013),100);
		timeSeries.add(new Month(2,2013),300);
		timeSeries.add(new Month(3,2013),200);
		timeSeries.add(new Month(4,2013),100);
		timeSeries.add(new Month(5,2013),400);
		timeSeries.add(new Month(6,2013),500);
		timeSeries.add(new Month(7,2013),900);
		timeSeries.add(new Month(8,2013),100);
		timeSeries.add(new Month(9,2013),600);
		timeSeries.add(new Month(10,2013),500);
		timeSeries.add(new Month(11,2013),400);
		timeSeries.add(new Month(12,2013),300);
		TimeSeriesCollection lineDataset=new TimeSeriesCollection();
		lineDataset.addSeries(timeSeries);
		JFreeChart chart=ChartFactory.createTimeSeriesChart("访问量", "月份","访问量", lineDataset, true, true, true);
		XYPlot plot=(XYPlot)chart.getPlot();
		DateAxis dateAxis=(DateAxis)plot.getDomainAxis();
		dateAxis.setDateFormatOverride(new java.text.SimpleDateFormat("M月"));
		dateAxis.setTickUnit(new DateTickUnit(DateTickUnit.MONTH, 1));
		
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
