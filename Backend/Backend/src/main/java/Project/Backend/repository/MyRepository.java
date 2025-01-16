package Project.Backend.repository;

import org.springframework.stereotype.Repository;

import Project.Backend.entity.MyEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

@Repository
public interface MyRepository extends JpaRepository<MyEntity, UUID> {
    // Define your data access methods here
    MyEntity findByName(String name);
}