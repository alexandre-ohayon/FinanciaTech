package com.financiatech.budgetmanager.service;

import com.financiatech.budgetmanager.dto.AuthResponse;
import com.financiatech.budgetmanager.dto.LoginRequest;
import com.financiatech.budgetmanager.dto.RegisterRequest;
import com.financiatech.budgetmanager.model.PasswordResetToken;
import com.financiatech.budgetmanager.model.User;
import com.financiatech.budgetmanager.repository.PasswordResetTokenRepository;
import com.financiatech.budgetmanager.repository.UserRepository;
import com.financiatech.budgetmanager.security.JwtService;
import com.financiatech.budgetmanager.service.email.MailService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final PasswordResetTokenRepository tokenRepository;
    private final MailService mailService;

    public AuthService(
            UserRepository userRepository,
            JwtService jwtService,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            PasswordResetTokenRepository tokenRepository,
            MailService mailService
    ) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenRepository = tokenRepository;
        this.mailService = mailService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        var user = new User(
                request.email(),
                passwordEncoder.encode(request.password()),
                "USER"
        );

        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token);
    }

    public AuthResponse login(LoginRequest request) {
        var authToken = new UsernamePasswordAuthenticationToken(request.email(), request.password());
        authenticationManager.authenticate(authToken);

        var user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token);
    }

    public void sendResetToken(String email) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = UUID.randomUUID().toString();
        var resetToken = new PasswordResetToken(email, token, Instant.now().plusSeconds(15 * 60));
        tokenRepository.save(resetToken);

        mailService.sendPasswordReset(email, token);
    }

    public void resetPassword(String token, String newPassword) {
        var reset = tokenRepository.findByToken(token)
                .filter(t -> t.getExpiresAt().isAfter(Instant.now()))
                .orElseThrow(() -> new RuntimeException("Invalid or expired token"));

        var user = userRepository.findByEmail(reset.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        tokenRepository.delete(reset);
    }
}
