package com.unicloud.unicloud_backend.service;
/*import com.unicloud.unicloud_backend.repository.EC2Repository;
import com.unicloud.unicloud_backend.model.EC2Instance;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class EC2Service {

    private final EC2Repository repo;

    public EC2Service(EC2Repository repo) {
        this.repo = repo;
    }

    // CREATE VM
    public EC2Instance createVM() {
        try {
            Process process = Runtime.getRuntime().exec(
                "docker run -d ubuntu sleep infinity"
            );

            BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream())
            );

            String containerId = reader.readLine();
            EC2Instance vm = new EC2Instance();
            vm.setContainerId(containerId);
            vm.setName("vm-" + containerId.substring(0, 5));
            vm.setStatus("RUNNING");

            return repo.save(vm);

        } catch (Exception e) {
            throw new RuntimeException("VM creation failed");
        }
    }

    // LIST VMs
    public List<EC2Instance> listVMs() {
        return repo.findAll();
    }

    // STOP VM
    public String stopVM(Long id) {
        EC2Instance vm = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("VM not found"));

        try {
            Runtime.getRuntime().exec("docker stop " + vm.getContainerId());
            vm.setStatus("STOPPED");
            repo.save(vm);
            return "Stopped Successfully";

        } catch (Exception e) {
            return "Failed to stop VM";
        }
    }
}
*/

/* running code
import org.apache.logging.log4j.CloseableThreadContext.Instance;
import org.springframework.stereotype.Service;
import java.io.*;
import java.net.ServerSocket;
import java.util.List;

import com.unicloud.unicloud_backend.model.EC2Instance;

import com.unicloud.unicloud_backend.repository.EC2Repository;

@Service
public class EC2Service {

    private final EC2Repository repository;

    public EC2Service(EC2Repository repository) {
        this.repository = repository;
    }

    // 🔹 Create Instance (Docker run)
    public EC2Instance createVM(String name) throws Exception {

        int port = getFreePort();

        Process process = Runtime.getRuntime().exec(
            "docker run -d -p " + port + ":8080 nginx"
        );

        BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream())
        );

        String containerId = reader.readLine();

        EC2Instance instance = new EC2Instance();
        instance.setName(name);
        instance.setContainerId(containerId);
        instance.setStatus("RUNNING");
        instance.setPort(port);

        return repository.save(instance);
        
    }

    // 🔹 Stop Instance
    public void stopVM(Long id) throws Exception {
        EC2Instance instance = repository.findById(id).orElseThrow();

        Runtime.getRuntime().exec("docker stop " + instance.getContainerId());

        instance.setStatus("STOPPED");
        repository.save(instance);
    }

    // 🔹 List Instances
    public List<EC2Instance> listVM() {
        return repository.findAll();
    }

    // 🔹 Dynamic Port
    private int getFreePort() throws IOException {
        ServerSocket socket = new ServerSocket(0);
        int port = socket.getLocalPort();
        socket.close();
        return port;
    }
}*/





import com.unicloud.unicloud_backend.model.EC2Instance;
import com.unicloud.unicloud_backend.repository.EC2Repository;
import com.unicloud.unicloud_backend.util.DockerUtil;
import com.unicloud.unicloud_backend.util.PostManager;

import org.apache.logging.log4j.CloseableThreadContext.Instance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.time.LocalDateTime;

@Service
public class EC2Service {

    @Autowired
    private EC2Repository repo;

public String create(String username,String name, String jarPath) {

    int port = PostManager.getNextPort();

    // 🔥 IMPORTANT: unique container name
    String containerName = "vm_" + name + "_" + port;

    String containerId =
        DockerUtil.runContainer(jarPath, port, containerName);

    EC2Instance inst = new EC2Instance();
    inst.setName(name);
    inst.setPort(port);
    inst.setContainerId(containerId);

    // 🔥 ADD THIS FIELD
    inst.setContainerName(containerName);

    inst.setStatus("RUNNING");

    inst.setUserId(username); // 🔥 IMPORTANT

    repo.save(inst);

    return "Instance running at http://localhost:" + port;
}
  /*   public Object getAll() {
        return repo.findAll();
    }*/

    public Object getUserInstances(String username) {
    return repo.findByUserId(username);
}

    public String stop(Long id) throws Exception {
        EC2Instance i = repo.findById(id).orElseThrow();
        DockerUtil.stop(i.getContainerId());
        i.setStatus("STOPPED");
        repo.save(i);
        return "Stopped";
    }

    public String delete(Long id) throws Exception {
        EC2Instance i = repo.findById(id).orElseThrow();
        DockerUtil.delete(i.getContainerId());
        repo.delete(i);
        return "Deleted";
    }

    public String status(Long id) throws Exception {
        EC2Instance i = repo.findById(id).orElseThrow();
        return DockerUtil.status(i.getContainerId());
    }

    public String logs(Long id) throws Exception {
        EC2Instance i = repo.findById(id).orElseThrow();
        return DockerUtil.logs(i.getContainerId());
    }


public String start(Long id) throws Exception {
    EC2Instance i = repo.findById(id).orElseThrow();

    Runtime.getRuntime().exec("docker start " + i.getContainerId());

    i.setStatus("RUNNING");
    repo.save(i);

    return "Started";
}
public String restart(Long id) throws Exception {
    EC2Instance i = repo.findById(id).orElseThrow();

    Runtime.getRuntime().exec("docker restart " + i.getContainerId());

    i.setStatus("RUNNING");
    repo.save(i);

    return "Restarted";
}
public String getRealStatus(Long id) throws Exception {
    EC2Instance i = repo.findById(id).orElseThrow();

    Process p = Runtime.getRuntime().exec(
        "docker ps -a --filter id=" + i.getContainerId() + " --format {{.Status}}"
    );

    BufferedReader reader = new BufferedReader(
        new InputStreamReader(p.getInputStream())
    );

    return reader.readLine();
}


}





