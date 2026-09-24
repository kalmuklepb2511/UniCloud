package com.unicloud.unicloud_backend.repository;
import com.unicloud.unicloud_backend.model.EC2Instance;
import org.springframework.data.jpa.repository.JpaRepository;
public interface EC2Repository extends JpaRepository<EC2Instance,Long>{

}