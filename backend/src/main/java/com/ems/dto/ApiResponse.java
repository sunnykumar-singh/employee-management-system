package com.ems.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;
import java.util.Map;
import lombok.Builder;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;
    private Instant timestamp;
    private Integer status;
    private String error;
    private String path;
    private Map<String, String> fieldErrors;

    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(Instant.now())
                .build();
    }

    public static <T> ApiResponse<T> failure(
            HttpStatus httpStatus, String message, String path, Map<String, String> fieldErrors) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .timestamp(Instant.now())
                .status(httpStatus.value())
                .error(httpStatus.getReasonPhrase())
                .path(path)
                .fieldErrors(fieldErrors)
                .build();
    }

    public static <T> ApiResponse<T> failure(HttpStatus httpStatus, String message, String path) {
        return failure(httpStatus, message, path, null);
    }
}
