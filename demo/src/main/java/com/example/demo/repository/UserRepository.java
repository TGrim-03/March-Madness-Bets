package com.example.demo.repository;

import org.springframework.data.repository.CrudRepository;

import com.example.demo.model.User;

/**
 * This class creates a repository to store user information. It is created automatically by Spring.
 */
// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository
// CRUD refers to Create, Read, Update, Delete
public interface UserRepository extends CrudRepository<User, Integer> {

}
