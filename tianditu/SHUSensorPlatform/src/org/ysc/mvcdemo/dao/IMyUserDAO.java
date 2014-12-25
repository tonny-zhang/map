package org.ysc.mvcdemo.dao;

import java.util.* ;

import org.ysc.mvcdemo.vo.MyUser;
public interface IMyUserDAO {
	// 现在完成的是登陆验证，那么登陆操作只有两种返回结果
	public boolean findLogin(MyUser user) throws Exception ;
	public boolean userRegister(MyUser user) throws Exception ;
} 