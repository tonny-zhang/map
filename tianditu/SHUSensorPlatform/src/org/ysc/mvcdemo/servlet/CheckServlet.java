package org.ysc.mvcdemo.servlet ;
import java.sql.* ;
import java.io.* ;
import javax.servlet.* ;
import javax.servlet.http.* ;
public class CheckServlet extends HttpServlet{
	public static final String DBDRIVER = "org.postgresql.Driver" ;
 	public static final String DBURL = "jdbc:postgresql:EnterChecked" ;
	public static final String DBUSER = "postgres";
	public static final String DBPASS = "gis";
	public void doGet(HttpServletRequest request,HttpServletResponse response) throws ServletException,IOException{
		this.doPost(request,response) ;
	}
	public void doPost(HttpServletRequest request,HttpServletResponse response) throws ServletException,IOException{
		request.setCharacterEncoding("GBK") ;
		response.setContentType("text/html") ;
		Connection conn = null ;
		PreparedStatement pstmt = null ;
		ResultSet rs = null ;
		PrintWriter out = response.getWriter() ;
		String userid = request.getParameter("userid") ;
		try{
			Class.forName("org.postgresql.Driver") ;
			conn = DriverManager.getConnection("jdbc:postgresql:EnterChecked","postgres","gis");
			String sql = "SELECT COUNT(userid) FROM myuser WHERE userid=?";
			pstmt = conn.prepareStatement(sql) ;
			pstmt.setString(1,userid) ;
			rs = pstmt.executeQuery() ;
			if(rs.next()){
				if(rs.getInt(1)>0){	// 用户ID已经存在了
					out.print("true") ;
				} else {
					out.print("false") ;
				}
			}
			out.close();
			
		}catch(Exception e){
			e.printStackTrace() ;
		}finally{
			try{
				conn.close() ;
			}catch(SQLException e){
				e.printStackTrace();
			}
		}
	}
}