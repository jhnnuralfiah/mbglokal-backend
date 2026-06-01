package com.kelompok7.mbglokal.controller;

import com.kelompok7.mbglokal.entity.Distribusi;
import com.kelompok7.mbglokal.service.DistribusiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/distribusi")
public class DistribusiController {

    @Autowired
    private DistribusiService service;

    // GET ALL
    @GetMapping
    public List<Distribusi> getAll() {
        return service.getAll();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public Distribusi getById(@PathVariable Long id) {
        return service.getById(id);
    }

    // POST
    @PostMapping
    public Object create(@RequestBody Distribusi distribusi) {

        try {

            return service.create(distribusi);

        } catch (RuntimeException e) {

            return java.util.Map.of(
                    "success", false,
                    "message", e.getMessage());
        }
    }

    // UPDATE STATUS
    @PutMapping("/{id}/status")
    public Distribusi updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return service.updateStatus(id, status);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    // FILTER STATUS
    @GetMapping("/status/{status}")
    public List<Distribusi> getByStatus(@PathVariable String status) {
        return service.getByStatus(status);
    }

    @GetMapping("/user/{idUser}")
    public List<Distribusi> getByUser(@PathVariable Long idUser) {
        return service.getByUser(idUser);
    }
}