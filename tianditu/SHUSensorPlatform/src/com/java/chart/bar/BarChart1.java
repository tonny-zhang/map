package com.java.chart.bar;

import java.awt.Font;

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

public class BarChart1 {
	public static String genBarChart(HttpSession session) throws Exception{
		double[][] data=new double[][]{{100,200,300,250},{200,100,300,400},{300,400,200,100},{200,400,300,100}};
		String[] rowKeys={"深圳","上海","北京","南京"};
		String[] columnKeys={"苹果","橘子","香蕉","西瓜"};
	//	DefaultCategoryDataset dataset= new DefaultCategoryDataset();
	//	 dataset.addValue(510,"深圳", "苹果");
		CategoryDataset dataset= DatasetUtilities.createCategoryDataset(rowKeys, columnKeys,data);
		
		
		

		
		JFreeChart  chart= ChartFactory.createBarChart3D("水果产量图","水果", "产量", dataset,PlotOrientation.VERTICAL, true,true,true);
		CategoryPlot plot =chart.getCategoryPlot();
		BarRenderer3D renderer = new BarRenderer3D();
		renderer.setItemLabelGenerator(new StandardCategoryItemLabelGenerator());
		renderer.setItemLabelFont(new Font("黑体",Font.PLAIN,12));
		renderer.setItemLabelsVisible(true);
		plot.setRenderer(renderer);
  	    String filename=ServletUtilities.saveChartAsJPEG(chart, 700, 500, session);
		return filename;
	}

}
