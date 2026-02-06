package com.Up2Play.backend.DTO;

import java.time.Instant;

public record ErrorResponseDto(
        String error,
        String message,
        int status,
        String path,
        Instant timestamp) {
}
