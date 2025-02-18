package Project.Backend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Project.Backend.entity.MyEntity;

@Repository
public interface MyRepository extends JpaRepository<MyEntity, UUID> {
    // Define your data access methods here
    MyEntity findByName(String name);
}