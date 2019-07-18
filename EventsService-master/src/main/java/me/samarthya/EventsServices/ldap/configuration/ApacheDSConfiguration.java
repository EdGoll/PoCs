package me.samarthya.EventsServices.ldap.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.ldap.repository.config.EnableLdapRepositories;
import org.springframework.ldap.core.ContextSource;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;
import org.springframework.security.ldap.search.FilterBasedLdapUserSearch;

@Configuration
@EnableLdapRepositories(basePackages = "me.samarthya.EventsServices.ldap")
public class ApacheDSConfiguration {
//
    @Bean
    ContextSource contextSource() {
        LdapContextSource ldapContextSource = new LdapContextSource();
        //ldapContextSource.setUserDn("uid=controlversiones,ou=Aduana");
        
        ldapContextSource.setUrl("ldap://172.20.101.7:389/");
      //  ldapContextSource.setUserDn("CN=Adm,CN=JBOSS,OU=Jboss,OU=Software,OU=Aduana");
        ldapContextSource.setPassword("aduana2k");
        ldapContextSource.setUserDn("CN=Control Versiones,OU=ControldeVersiones,DC=iris,DC=aduana,DC=cl");
        ldapContextSource.setBase("DC=iris,DC=aduana,DC=cl");   
        //ldapContextSource.set
        return ldapContextSource;
    }
//    
	    

//    @Bean
//    LdapTemplate ldapTemplate(ContextSource contextSource) {
//        return new LdapTemplate(contextSource);
//    }
    
    @Bean
    LdapTemplate ldapTemplate(ContextSource contextSource) {
        LdapTemplate ldapTemplate = new LdapTemplate(contextSource);
        ldapTemplate.setIgnorePartialResultException(true);
        return ldapTemplate;
    }
}


