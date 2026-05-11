package com.kelompok7.mbglokal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kelompok7.mbglokal.entity.DetailMenu;

@Repository
public interface DetailMenuRepository extends JpaRepository<DetailMenu, Long> {
    // Kosongin, Spring Boot udah otomatis ngerti cara CRUD-nya
}