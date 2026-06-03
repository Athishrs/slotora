package com.slotora.service;

import com.slotora.dto.request.LoginRequest;
import com.slotora.dto.request.RegisterRequest;
import com.slotora.dto.response.AuthResponse;
import com.slotora.entity.User;
import com.slotora.exception.EmailAlreadyExistsException;
import com.slotora.repository.UserRepository;
import com.slotora.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    // Register a new user
    public AuthResponse register(RegisterRequest request) {

        // Step 1 — check email not already taken
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(
                    "Email already in use: " + request.getEmail()
            );
        }

        // Step 2 — build the User entity
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(
                passwordEncoder.encode(request.getPassword())
        );

        // Step 3 — save to database
        userRepository.save(user);

        // Step 4 — generate JWT
        String token = jwtService.generateToken(user.getEmail());

        // Step 5 — return response
        return new AuthResponse(token, user.getName(), user.getEmail());
    }

    // Login existing user
    public AuthResponse login(LoginRequest request) {

        // Step 1 — verify credentials
        // throws exception automatically if wrong
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Step 2 — load user from database
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        // Step 3 — generate JWT
        String token = jwtService.generateToken(user.getEmail());

        // Step 4 — return response
        return new AuthResponse(token, user.getName(), user.getEmail());
    }
}