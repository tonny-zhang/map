package com.tianditu.servlet;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.tianditu.util.HttpConnectionUtil;

/**
 * Servlet implementation class BuslineServlet
 */
public class BuslineServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /**
     * Default constructor. 
     */
    public BuslineServlet() {
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String param = request.getParameter("postStr");
		//为方便测试，采用线上地址来搜索
		String url = "http://www.tianditu.cn/query.shtml";
		String postStr = "type=busline&postStr="+param;
		String result = HttpConnectionUtil.AccessUrl(url, postStr);
	    try {
	    	response.getOutputStream().write(result.getBytes("UTF-8"));
	    	response.getOutputStream().flush();
	    	response.getOutputStream().close();
	    } catch (IOException e) {
    		e.printStackTrace();
	    }
	}

}
