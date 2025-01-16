package Project.Backend.services;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Project.Backend.entity.MyEntity;
import Project.Backend.repository.MyRepository;

@Service
public class MyService {
    
    @Autowired
    private MyRepository repository;
    
    public List<MyEntity> getAllEntities() {
        return repository.findAll();
    }

    public MyEntity addEntity(MyEntity entity) {
        return repository.save(entity);
    }

    public MyEntity getEntityById(UUID id) {
        return repository.findById(id).orElse(null);
    }

    public MyEntity getEntityByName(String name) {
        return repository.findByName(name);
    }

    public void deleteAllEntities() {
        repository.deleteAll();
    }
}