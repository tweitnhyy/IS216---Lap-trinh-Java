package com.example.webve.service;

import com.example.webve.model.District;
import com.example.webve.model.Province;
import com.example.webve.model.Ward;
import com.example.webve.repository.DistrictRepository;
import com.example.webve.repository.ProvinceRepository;
import com.example.webve.repository.WardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class LocationService {
    @Autowired
    private DistrictRepository districtRepository;

    @Autowired
    private ProvinceRepository provinceRepository;

    @Autowired
    private WardRepository wardRepository;


    public List<Province> getAllProvinces() {
        return provinceRepository.findAll();
    }

    public List<District> getDistrictsByProvinceId(Integer provinceId) {
        if (provinceId == null) {
            throw new IllegalArgumentException("Province ID cannot be null");
        }
        return districtRepository.findByProvinceId(provinceId);
    }

    public List<Ward> getWardsByDistrictId(Integer districtId) {
        if (districtId == null) {
            throw new IllegalArgumentException("District ID cannot be null");
        }
        return wardRepository.findByDistrictId(districtId);
    }
}
