package me.samarthya.EventsServices.configuration;

import java.util.Arrays;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.ldap.core.support.LdapContextSource;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;


@Configuration
@EnableWebSecurity(debug = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    private static final Logger logger = LoggerFactory.getLogger(WebSecurityConfig.class);


    @Autowired
    private LdapContextSource ldapContextSource;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
//        http.httpBasic().and().authorizeRequests().antMatchers("/users","/").permitAll()
//                .anyRequest().authenticated().and().csrf().disable();
    	 http.authorizeRequests().anyRequest().permitAll();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.ldapAuthentication().contextSource(ldapContextSource)
                .userSearchBase("OU=Jboss,OU=Jboss,OU=Software,OU=Aduana")
                .groupSearchBase("OU=Aduana")
                //.groupSearchFilter("member={0}")
                .userDnPatterns("CN=Control Versiones,OU=ControldeVersiones,DC=iris,DC=aduana,DC=cl")
                .userSearchFilter("sAMAccountName={0}");
    }
}
//
//Arrays.asList("ldap://172.20.101.7:389/"), "dc=iris,dc=aduana,dc=cl"){{
//setUserDn("CN=Adm,CN=JBOSS,OU=Jboss,OU=Software,OU=Aduana,DC=iris,DC=aduana,DC=cl");
//setPassword("aduana2k");
