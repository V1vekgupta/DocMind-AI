package com.docmind.service;

import com.docmind.security.CustomUserDetailsService;
import com.docmind.exception.ConflictException;
import com.docmind.model.dto.request.LoginRequest;
import com.docmind.model.dto.request.RegisterRequest;
import com.docmind.model.dto.response.AuthResponse;
import com.docmind.model.dto.response.UserResponse;
import com.docmind.model.entity.Role;
import com.docmind.model.entity.User;
import com.docmind.repository.UserRepository;
import com.docmind.util.DtoMapper;
import com.docmind.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email is already registered");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        User savedUser = userRepository.save(user);
        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .user(DtoMapper.toUserResponse(savedUser))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ConflictException("User not found"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .user(DtoMapper.toUserResponse(user))
                .build();
    }

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ConflictException("User not found"));
        return DtoMapper.toUserResponse(user);
    }
}
