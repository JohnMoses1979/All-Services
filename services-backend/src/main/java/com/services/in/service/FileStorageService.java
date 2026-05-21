package com.services.in.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Set;

/**
 * Handles saving uploaded provider documents to the local filesystem.
 *
 * Folder layout:
 *   {app.upload.dir}/documents/provider_{id}/aadhaar.{ext}
 *   {app.upload.dir}/documents/provider_{id}/pan.{ext}
 *
 * Returns the relative path string saved in the database.
 */
@Service
public class FileStorageService {

    private static final Set<String> ALLOWED_TYPES =
            Set.of("image/jpeg", "image/jpg", "image/png", "image/webp");

    private static final long MAX_BYTES = 5L * 1024 * 1024; // 5 MB

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    /**
     * Saves a document file for a specific provider.
     *
     * @param providerId numeric DB id of the provider
     * @param file       the uploaded MultipartFile
     * @param docType    "aadhaar" or "pan"
     * @return relative path string, e.g. "documents/provider_3/aadhaar.jpg"
     */
    public String saveDocument(Long providerId, MultipartFile file, String docType)
            throws IOException {

        validateFile(file, docType);

        // Build provider-specific folder: uploads/documents/provider_3/
        String providerFolder = "documents/provider_" + providerId;
        Path folderPath = Paths.get(uploadDir, providerFolder);
        Files.createDirectories(folderPath); // creates all missing folders

        // Derive extension from original filename, default to jpg
        String originalName = file.getOriginalFilename() != null
                ? file.getOriginalFilename() : "file.jpg";
        String ext = originalName.contains(".")
                ? originalName.substring(originalName.lastIndexOf(".") + 1).toLowerCase()
                : "jpg";

        // Fixed filename per doc type — overwrites if re-uploaded
        String fileName = docType + "." + ext;
        Path filePath = folderPath.resolve(fileName);

        // Write bytes to disk
        Files.write(filePath, file.getBytes(), StandardOpenOption.CREATE,
                StandardOpenOption.TRUNCATE_EXISTING);

        // Return relative path for DB storage
        return providerFolder + "/" + fileName;
    }

    /**
     * Deletes the provider's document folder if it exists.
     * Called when rolling back a failed signup.
     */
    public void deleteProviderFolder(Long providerId) {
        try {
            Path folder = Paths.get(uploadDir, "documents", "provider_" + providerId);
            if (Files.exists(folder)) {
                Files.walk(folder)
                     .sorted(java.util.Comparator.reverseOrder())
                     .forEach(p -> { try { Files.delete(p); } catch (IOException ignored) {} });
            }
        } catch (IOException ignored) {}
    }

    private void validateFile(MultipartFile file, String docType) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    docType + " document is required and cannot be empty.");
        }
        if (file.getSize() > MAX_BYTES) {
            throw new IllegalArgumentException(
                    docType + " file must be under 5 MB.");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException(
                    docType + " must be a JPEG, PNG, or WebP image.");
        }
    }
}