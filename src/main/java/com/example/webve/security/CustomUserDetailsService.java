package com.example.webve.security;

import com.example.webve.model.User;
import com.example.webve.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;


@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println("Đang đăng nhập với email: " + email);

        User user = userRepository.findByEmail(email);
        if (user == null) {
            System.out.println("Không tìm thấy user với email: " + email);
            throw new UsernameNotFoundException("Không tìm thấy người dùng với email: " + email);
        }

        System.out.println("Tìm thấy user: " + user.getEmail());

        // Trả về đối tượng UserDetails từ Spring Security mà không cần CustomUserDetails
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())  // Email là username trong trường hợp này
                .password(user.getPassword())   // Sử dụng mật khẩu của người dùng
                .roles("USER")                  // Gán quyền ROLE_USER cho người dùng
                .build();
    }
}
