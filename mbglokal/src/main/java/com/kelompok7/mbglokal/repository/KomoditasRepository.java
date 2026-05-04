package com.kelompok7.mbglokal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kelompok7.mbglokal.entity.Komoditas;

@Repository
public interface KomoditasRepository extends JpaRepository<Komoditas, Long> {
}