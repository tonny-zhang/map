package com.java.chart.pie;

import java.awt.Dimension;
import java.awt.Font;
import java.text.DecimalFormat;
import java.text.NumberFormat;

import javax.servlet.http.HttpSession;

import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartPanel;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.labels.StandardPieSectionLabelGenerator;
import org.jfree.chart.plot.PiePlot3D;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.chart.servlet.ServletUtilities;
import org.jfree.chart.title.TextTitle;
import org.jfree.data.general.DefaultPieDataset;
import org.jfree.util.Rotation;

public class PieChart1 {
	public static String genPieChart(HttpSession session) throws Exception{
		DefaultPieDataset dataset= new DefaultPieDataset();
		dataset.setValue("C++", 0.2);
		dataset.setValue("C#", 0.3);
		dataset.setValue("Java", 0.45);
		dataset.setValue("JSP", 0.05);
		JFreeChart  chart=ChartFactory.createPieChart3D("各语言使用比例图", dataset, true, true, false);
		PiePlot3D plot=(PiePlot3D)chart.getPlot();
		plot.setStartAngle(90);
		plot.setDirection(Rotation.CLOCKWISE);
		plot.setForegroundAlpha(0.9f);
		plot.setLabelFont(new Font("黑体", Font.PLAIN, 20));
        plot.setExplodePercent("Java", 0.45);
        
        plot.setNoDataMessage("无数据可供显示！"); // 没有数据的时候显示的内容 
        plot.setLabelGenerator(new StandardPieSectionLabelGenerator( 
        ("{0}: ({2})"), NumberFormat.getNumberInstance(), 
        new DecimalFormat("0.00%"))); 
		TextTitle textTitle=chart.getTitle();
		textTitle.setFont(new Font("黑体",Font.ITALIC,20));
		
		
		ChartPanel chartPanel= new ChartPanel(chart);
		chartPanel.setPreferredSize(new Dimension(200,270));
		setContentPane(chartPanel); 
		
		chart.getLegend().setItemFont(new Font("宋体", Font.PLAIN, 12));
		
		String filename=ServletUtilities.saveChartAsPNG(chart, 700, 500, session);
		
		return filename;
	}

	private static void setContentPane(ChartPanel chartPanel) {
		// TODO Auto-generated method stub
		
	}

}
