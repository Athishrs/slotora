package com.slotora.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // Step 1 — read Authorization header
        String authHeader = request.getHeader("Authorization");

        // Step 2 — if no token pass through to next filter
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Step 3 — extract token (remove "Bearer " prefix)
        String token = authHeader.substring(7);

        // Step 4 — extract email from token
        String email = jwtService.extractEmail(token);

        // Step 5 — if email found and user not yet authenticated
        if (email != null &&
                SecurityContextHolder.getContext()
                        .getAuthentication() == null) {

            // Step 6 — load user from database
            UserDetails userDetails =
                    userDetailsService.loadUserByUsername(email);

            // Step 7 — validate token
            if (jwtService.isTokenValid(token, email)) {

                // Step 8 — create authentication object
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authToken.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                // Step 9 — tell Spring Security this user is authenticated
                SecurityContextHolder.getContext()
                        .setAuthentication(authToken);
            }
        }

        // Step 10 — pass to next filter or controller
        filterChain.doFilter(request, response);
    }
}