package com.agrichain.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.Base64;

@Service
public class QRCodeService {
    
    public String generateQRCodeImage(String text, int width, int height) {
        try {
            if (text == null || text.trim().isEmpty()) {
                throw new IllegalArgumentException("Text cannot be null or empty for QR code generation");
            }
            
            System.out.println("Generating QR code for text: " + text);
            
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);
            
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            
            byte[] qrCodeBytes = outputStream.toByteArray();
            String base64QRCode = Base64.getEncoder().encodeToString(qrCodeBytes);
            
            System.out.println("QR code generated successfully");
            return base64QRCode;
        } catch (Exception e) {
            System.err.println("Failed to generate QR code: " + e.getMessage());
            e.printStackTrace();
            // Return a placeholder or error image instead of throwing exception
            return generateErrorQRCode(width, height, "Error: " + e.getMessage());
        }
    }
    
    private String generateErrorQRCode(int width, int height, String errorMessage) {
        try {
            // Create a simple error QR code
            String errorText = "QR Generation Error: " + errorMessage;
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(errorText, BarcodeFormat.QR_CODE, width, height);
            
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            
            byte[] qrCodeBytes = outputStream.toByteArray();
            return Base64.getEncoder().encodeToString(qrCodeBytes);
        } catch (Exception e) {
            System.err.println("Failed to generate error QR code: " + e.getMessage());
            // Return a simple placeholder string
            return "qrcode-error";
        }
    }
}