package org.ysc.mvcdemo.dao.proxy ;
import org.ysc.mvcdemo.vo.MyUser ;
import org.ysc.mvcdemo.dbc.* ;
import org.ysc.mvcdemo.dao.* ;
import org.ysc.mvcdemo.dao.impl.* ;
import java.sql.* ;
public class UserDAOProxy implements IMyUserDAO {
	private DatabaseConnection dbc = null ;
	private IMyUserDAO dao = null ;
	public UserDAOProxy(){
		try{
			this.dbc = new DatabaseConnection() ;
		}catch(Exception e){
			e.printStackTrace() ;
		}
		this.dao = new UserDAOImpl(dbc.getConnection()) ;
	}
	public boolean findLogin(MyUser user) throws Exception{
		boolean flag = false ;
		try{
			flag = this.dao.findLogin(user) ;	// 调用真实主题，完成操作
		}catch(Exception e){
			throw e ;
		}finally{
			this.dbc.close() ;
		}
		return flag ;
	}
	public boolean userRegister(MyUser user) throws Exception{
		boolean flag = false ;
		try{
			flag = this.dao.userRegister(user) ;	// 调用真实主题，完成操作
		}catch(Exception e){
			throw e ;
		}finally{
			this.dbc.close() ;
		}
		return flag ;
	}
} 