package Project.Backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Project.Backend.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	public User findByName(String name);
	public User findByEmail(String Email);
	public User findByUserId(User user);
	public boolean existsByEmail(String email);
	public boolean existsByName(String name);
	
	List<User> findByNameContainingIgnoreCase(String name);

	List<User> findByEmailContainingIgnoreCase(String email);

	
}
