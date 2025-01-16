// package Project.Backend;

// import java.util.List;
// import java.util.UUID;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.SpringApplication;
// import org.springframework.boot.autoconfigure.SpringBootApplication;
// import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
// import org.springframework.context.ConfigurableApplicationContext;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.CrossOrigin;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.RequestParam;
// import org.springframework.web.bind.annotation.RestController;

// @SpringBootApplication(
// 	exclude = {
// 			SecurityAutoConfiguration.class	// 기본 로그인이 뜨도록
// 	}
// )
// public class PackApplication {

// 	public static void main(String[] args) {
// 		// SpringApplication.run(PackApplication.class, args);
//         ConfigurableApplicationContext context = SpringApplication.run(PackApplication.class, args);

//         MyService myService = context.getBean(MyService.class);
// 	}

// }
// @RestController
// @CrossOrigin(origins = "http://localhost:3000")
// class MyController {

//     @Autowired
//     private MyService service;

//     @GetMapping("/")
//     public ResponseEntity<String> hello() {
//         String body = "Hello, world!";
//         return ResponseEntity.ok(body);
//     }

//     @GetMapping("/add_entity")
//     public UUID addEntity(@RequestParam String name) {
//         MyEntity entity = new MyEntity();
//         entity.setName(name);
//         MyEntity savedEntity = service.addEntity(entity);
//         UUID savedId = savedEntity.getId();
//         return savedId;
//     }

//     @GetMapping("/get_all_entities")
//     public List<MyEntity> getAllEntities() {
//         return service.getAllEntities();
//     }

//     @GetMapping("/get_entity_by_id")
//     public MyEntity getEntityById(@RequestParam UUID id) {
//         MyEntity retrievedEntity = service.getEntityById(id);
//         return retrievedEntity;
//     }

//     @GetMapping("/get_entity_by_name")
//     public MyEntity getEntityByName(@RequestParam String name) {
//         MyEntity retrievedEntity = service.getEntityByName(name);
//         return retrievedEntity;
//     }
    
//     @GetMapping("/delete_all")
//     public void deleteAllEntities() {
//         service.deleteAllEntities();
//         return;
//     }
// }