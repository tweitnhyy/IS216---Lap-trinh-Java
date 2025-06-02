package com.example.webve.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {
    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String getImageURLAfterUpload(MultipartFile file) throws IOException {
        Map upload = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap(
                  "folder", "Image"
                ));
        return (String) upload.get("url");
    }

    public String getVideoURLAfterUpload(MultipartFile file) throws IOException {
        Map upload = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap(
                        "resource_type", "video",
                        "folder", "Video"
                ));
        return (String) upload.get("url");
    }
}
