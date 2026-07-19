package com.docmind.controller;

import com.docmind.model.dto.response.PdfResponse;
import com.docmind.service.PdfService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/pdfs")
@RequiredArgsConstructor
public class PdfController {

    private final PdfService pdfService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PdfResponse> uploadPdf(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestPart("file") MultipartFile file
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(pdfService.uploadPdf(userDetails.getUsername(), file));
    }

    @GetMapping
    public ResponseEntity<List<PdfResponse>> getPdfs(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(pdfService.getUserPdfs(userDetails.getUsername()));
    }

    @GetMapping("/{pdfId}")
    public ResponseEntity<PdfResponse> getPdf(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long pdfId
    ) {
        return ResponseEntity.ok(pdfService.getPdf(userDetails.getUsername(), pdfId));
    }

    @DeleteMapping("/{pdfId}")
    public ResponseEntity<Void> deletePdf(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long pdfId
    ) {
        pdfService.deletePdf(userDetails.getUsername(), pdfId);
        return ResponseEntity.noContent().build();
    }
}
