package org.ysc.mvcdemo.servlet ;
import java.io.* ;
import java.util.* ;

import javax.servlet.* ;
import javax.servlet.http.* ;

import org.ysc.mvcdemo.factory.* ;
import org.ysc.mvcdemo.vo.* ;
public class RegisterServlet extends HttpServlet {
	public void doGet(HttpServletRequest req,HttpServletResponse resp) throws ServletException,IOException{
		String path = "UserReg.jsp" ;
		String userid = req.getParameter("userid") ;
		String username = req.getParameter("username") ;
		String userpass = req.getParameter("userpass") ;
		List<String> info = new ArrayList<String>() ;	// 收集错误
		if(userid==null || "".equals(userid)){
			info.add("用户id不能为空！") ;
		}
		
		if(userpass==null || "".equals(userpass)){
			info.add("密码不能为空！") ;
		}
		if(info.size()==0){	// 里面没有记录任何的错误
			MyUser user = new MyUser() ;
			user.setUserid(userid) ;
			user.setName(username);
			user.setPassword(userpass) ;
			try{
				if(DAOFactory.getIUserDAOInstance().findLogin(user)){
					info.add("用户名已经存在，请重新注册！") ;
				} else 
				if(DAOFactory.getIUserDAOInstance().userRegister(user)){
					info.add("用户注册成功，请重新登录！") ;
				} else {
					info.add("用户注册失败，请重新注册！") ;
				}
			}catch(Exception e){
				e.printStackTrace() ;
			}
		}
		req.setAttribute("info",info) ;
		req.getRequestDispatcher(path).forward(req,resp) ;
	}
	public void doPost(HttpServletRequest req,HttpServletResponse resp) throws ServletException,IOException{
		this.doGet(req,resp) ;
	}


}