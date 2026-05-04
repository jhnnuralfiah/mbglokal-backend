package com.kelompok7.mbglokal.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kelompok7.mbglokal.entity.Distribusi;
import com.kelompok7.mbglokal.repository.DistribusiRepository;

@Service
public class DistribusiServiceImpl implements DistribusiService {

    @Autowired
    private DistribusiRepository repo;

    @Override
    public List<Distribusi> getAll() {
        return repo.findAll();
    }

    @Override
    public Distribusi getById(Long id) {
        return repo.findById(id).orElseThrow();
    }

    @Override
    public Distribusi create(Distribusi distribusi) {
        return repo.save(distribusi);
    }

    @Override
    public Distribusi updateStatus(Long id, String status) {
        Distribusi d = repo.findById(id).orElseThrow();
        d.setStatus(status);
        return repo.save(d);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }

    @Override
    public List<Distribusi> getByStatus(String status) {
        return repo.findByStatus(status);
    }
}