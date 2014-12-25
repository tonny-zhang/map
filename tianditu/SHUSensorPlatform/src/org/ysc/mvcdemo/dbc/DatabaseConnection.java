package org.ysc.mvcdemo.dbc;

import java.sql.Connection ;
import java.sql.DriverManager ;
public class DatabaseConnection {
	private static final String DBDRIVER = "org.postgresql.Driver" ; 
	private static final String DBURL = "jdbc:postgresql:EnterChecked" ;
	private static final String DBUSER = "postgres" ;
	private static final String DBPASSWORD = "gis" ;
	private Connection conn ;
	public DatabaseConnection() throws Exception {
		Class.forName(DBDRIVER) ;
		this.conn = DriverManager.getConnection(DBURL,DBUSER,DBPASSWORD) ;
	}
	public Connection getConnection(){
		return this.conn ;
	}
	public void close() throws Exception {
		if(this.conn != null){
			try{
				this.conn.close() ;
			}catch(Exception e){
				throw e ;
			}
		}
	}
}