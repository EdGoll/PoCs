package me.samarthya.EventsServices.controllers;

import me.samarthya.EventsServices.ldap.model.UserModel;
import me.samarthya.EventsServices.ldap.repository.ApacheDSRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
public class ControllerOne {

    private final static Logger logger = LoggerFactory.getLogger(ControllerOne.class);

    @Autowired
    ApacheDSRepository apacheDSRepository;

    @Autowired
    ApplicationContext context;

    @GetMapping("/")
    @ResponseBody
    public String bonsoir(@RequestParam(name = "id", required = false) String id, HttpServletRequest request) {
        if (id != null)
            return "Bonsoir " + id + " !";
        else
            return "Bonsoir!";
    }

    @ResponseBody
    @GetMapping("/error2")
    public String errorMessage(HttpServletRequest request, HttpServletResponse response) {

        return "Error occurred, please see the server logs.";
    }


    @ResponseBody
    @GetMapping("/users")
    public Iterable<UserModel> getAllUsers() {
    	logger.info("getAllUsers");
        return apacheDSRepository.findAll();
    }
    
    
    @ResponseBody
    @GetMapping("/users/")
    public UserModel getByUserName(@RequestParam(name = "userName", required = true) String userName, HttpServletRequest request) {
    	logger.info("getByUserName");
    	logger.info(userName);
        return apacheDSRepository.findByUid(userName);
    }

    @ResponseBody
    @PostMapping("/protected")
    public String protectedMethod(HttpServletRequest request) {
        logger.debug(" Requested: " + request.getRequestURI() + " : " + request.getUserPrincipal().getName() + " : " + context.getApplicationName());
        return "Method Protected";
    }
}
