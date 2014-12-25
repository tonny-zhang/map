package org.ysc.mvcdemo.factory ;
import org.ysc.mvcdemo.dao.* ;
import org.ysc.mvcdemo.dao.proxy.* ;
public class DAOFactory {
	public static IMyUserDAO getIUserDAOInstance(){
		return new UserDAOProxy() ;
	}
}