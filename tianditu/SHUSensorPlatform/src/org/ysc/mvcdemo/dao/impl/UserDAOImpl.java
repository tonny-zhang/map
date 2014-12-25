package org.ysc.mvcdemo.dao.impl ;
import org.ysc.mvcdemo.vo.MyUser;
import org.ysc.mvcdemo.dbc.* ;
import org.ysc.mvcdemo.dao.* ;

import java.sql.* ;
public class UserDAOImpl implements IMyUserDAO {
	private Connection conn = null ;
	private PreparedStatement pstmt = null ;
	public UserDAOImpl(Connection conn){
		this.conn = conn ;
	}
	public boolean findLogin(MyUser user) throws Exception{
		boolean flag = false ;
		String sql = "SELECT name FROM myuser WHERE userid=? AND password=?" ;
		this.pstmt = this.conn.prepareStatement(sql) ;
		this.pstmt.setString(1,user.getUserid()) ;
		this.pstmt.setString(2,user.getPassword()) ;
		ResultSet rs = this.pstmt.executeQuery() ;
		if(rs.next()){
			user.setName(rs.getString(1)) ;	// 取出一个用户的真实姓名
			flag = true ;
		}
		this.pstmt.close() ;
		return flag ;
	}
	public boolean userRegister(MyUser user) throws Exception{
		boolean flag = false ;
		String sql = "insert into myuser (userid,name,password) values(?,?,?)" ;
		this.pstmt = this.conn.prepareStatement(sql) ;
		this.pstmt.setString(1,user.getUserid()) ;
		this.pstmt.setString(2,user.getName()) ;
		this.pstmt.setString(3,user.getPassword()) ;
		int rs = this.pstmt.executeUpdate() ;
		if(rs!=0){
			//user.setName(rs.getString(1)) ;	// 取出一个用户的真实姓名
			flag = true ;
		}
		this.pstmt.close() ;
		return flag ;
	}
} 