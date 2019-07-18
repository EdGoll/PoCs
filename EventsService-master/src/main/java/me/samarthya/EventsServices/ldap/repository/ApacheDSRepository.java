package me.samarthya.EventsServices.ldap.repository;


import me.samarthya.EventsServices.ldap.model.UserModel;
import org.springframework.data.ldap.repository.LdapRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ApacheDSRepository extends LdapRepository<UserModel> {

	public UserModel  findByUid(String uid);
	
}

