package com.kelompok7.mbglokal.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kelompok7.mbglokal.entity.Petani;
import com.kelompok7.mbglokal.service.PetaniService;

@RestController
@RequestMapping("/api/petani")
public class PetaniController {

    private final PetaniService petaniService;

    public PetaniController(PetaniService petaniService) {
        this.petaniService = petaniService;
    }

    // API GET: http://localhost:8080/api/petani
    @GetMapping
    public List<Petani> getAllPetani() {
        return petaniService.getAllPetani();
    }

    // API GET by ID: http://localhost:8080/api/petani/1
    @GetMapping("/{id}")
    public ResponseEntity<Petani> getPetaniById(@PathVariable Long id) {
        Optional<Petani> petani = petaniService.getPetaniById(id);
        return petani.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // API POST: http://localhost:8080/api/petani
    @PostMapping
    public Petani createPetani(@RequestBody Petani petani) {
        return petaniService.createPetani(petani);
    }

    // API DELETE: http://localhost:8080/api/petani/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePetani(@PathVariable Long id) {
        petaniService.deletePetani(id);
        return ResponseEntity.ok().build();
    }
}