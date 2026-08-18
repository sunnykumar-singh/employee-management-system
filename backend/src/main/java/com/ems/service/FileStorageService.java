package com.ems.service;

import com.ems.exception.BadRequestException;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif");

    private final Path rootLocation;

    public FileStorageService(@Value("${app.upload-dir:uploads}") String uploadDir) {
        this.rootLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    @PostConstruct
    void init() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException exception) {
            throw new IllegalStateException("Could not create upload directory: " + rootLocation, exception);
        }
    }

    public String store(MultipartFile file, String folder) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Photo file is required.");
        }

        String contentType = file.getContentType() == null ? "" : file.getContentType().toLowerCase(Locale.ROOT);
        if (!ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new BadRequestException("Only JPG, PNG, WEBP, or GIF images are allowed.");
        }

        String extension = resolveExtension(file.getOriginalFilename(), contentType);
        String filename = UUID.randomUUID() + extension;
        Path folderPath = rootLocation.resolve(folder).normalize();

        try {
            Files.createDirectories(folderPath);
            Path destination = folderPath.resolve(filename).normalize();
            if (!destination.startsWith(rootLocation)) {
                throw new BadRequestException("Invalid upload path.");
            }
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destination, StandardCopyOption.REPLACE_EXISTING);
            }
            return "/api/files/" + folder + "/" + filename;
        } catch (IOException exception) {
            throw new IllegalStateException("Failed to store uploaded file.", exception);
        }
    }

    public Resource loadAsResource(String folder, String filename) {
        try {
            Path file = rootLocation.resolve(folder).resolve(filename).normalize();
            if (!file.startsWith(rootLocation) || !Files.exists(file)) {
                throw new BadRequestException("File not found.");
            }
            Resource resource = new UrlResource(file.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new BadRequestException("File not found.");
            }
            return resource;
        } catch (IOException exception) {
            throw new BadRequestException("File not found.");
        }
    }

    public void deleteQuietly(String publicUrl) {
        if (!StringUtils.hasText(publicUrl) || !publicUrl.startsWith("/api/files/")) {
            return;
        }

        String relative = publicUrl.substring("/api/files/".length());
        Path file = rootLocation.resolve(relative).normalize();
        if (!file.startsWith(rootLocation)) {
            return;
        }
        try {
            Files.deleteIfExists(file);
        } catch (IOException ignored) {
            // Best-effort cleanup when replacing photos.
        }
    }

    private String resolveExtension(String originalFilename, String contentType) {
        String filename = StringUtils.cleanPath(originalFilename == null ? "" : originalFilename);
        int dot = filename.lastIndexOf('.');
        if (dot >= 0 && dot < filename.length() - 1) {
            return filename.substring(dot).toLowerCase(Locale.ROOT);
        }
        return switch (contentType) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/gif" -> ".gif";
            default -> ".jpg";
        };
    }
}
