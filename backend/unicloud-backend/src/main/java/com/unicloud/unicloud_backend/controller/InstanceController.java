package com.unicloud.unicloud_backend.controller;

/* 

import java.util.List;

import org.apache.logging.log4j.CloseableThreadContext.Instance;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.unicloud.unicloud_backend.model.EC2Instance;
import com.unicloud.unicloud_backend.service.EC2Service;
import java.io.File;

@RestController
@RequestMapping("/instances")
public class InstanceController {

    private final EC2Service service;

    public InstanceController(EC2Service service) {
        this.service = service;
    }

   //  🚀 Launch instance
   @PostMapping
    public EC2Instance create(@RequestParam String name) throws Exception {
        return service.createVM(name);
    }

    // 📄 List
    @GetMapping
    public List<EC2Instance> getAll() {
        return service.listVM();
    }

    // 🛑 Stop
    @PostMapping("/stop/{id}")
    public String stop(@PathVariable Long id) throws Exception {
        service.stopVM(id);
        return "Stopped";
    }



}*/




import com.unicloud.unicloud_backend.service.EC2Service;
import com.unicloud.unicloud_backend.repository.EC2Repository;
import com.unicloud.unicloud_backend.model.EC2Instance;

import org.apache.logging.log4j.CloseableThreadContext.Instance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import lombok.*;
@RestController
@RequestMapping("/instances")
public class InstanceController {
@Autowired
    private EC2Service service;

        
    @Autowired
    private EC2Repository repo;
    @PostMapping("/create")
    public String create(@RequestParam String name,
                         @RequestParam String jarPath) {
        return service.create(name, jarPath);
    }

    @GetMapping("/all")
    public Object all() {
        return service.getAll();
    }

    @PostMapping("/stop/{id}")
    public String stop(@PathVariable Long id) throws Exception {
        return service.stop(id);
    }

    @DeleteMapping("/delete/{id}")
    public String delete(@PathVariable Long id) throws Exception {
        return service.delete(id);
    }

    @GetMapping("/status/{id}")
    public String status(@PathVariable Long id) throws Exception {
        return service.status(id);
    }

    @GetMapping("/logs/{id}")
    public String logs(@PathVariable Long id) throws Exception {
        return service.logs(id);
    }



    @PostMapping("/start/{id}")
public String start(@PathVariable Long id) throws Exception {
    return service.start(id);
}
@GetMapping("/{id}")
public EC2Instance getOne(@PathVariable Long id) {
return repo.findById(id).orElseThrow();
}
}