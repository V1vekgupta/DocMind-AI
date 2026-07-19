package com.docmind.repository;

import com.docmind.model.entity.PdfDocument;
import com.docmind.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PdfDocumentRepository extends JpaRepository<PdfDocument, Long> {

    List<PdfDocument> findByUserOrderByCreatedAtDesc(User user);

    Optional<PdfDocument> findByIdAndUser(Long id, User user);
}
