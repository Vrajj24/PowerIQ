package com.poweriq.backend;
import com.poweriq.backend.repositories.UserRepository;
import com.poweriq.backend.services.AccountDataService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
@Component
public class DataInitializer implements CommandLineRunner {
    private final UserRepository users;
    private final AccountDataService data;
    public DataInitializer(UserRepository users, AccountDataService data) { this.users=users; this.data=data; }
    public void run(String... args) { users.findAll().forEach(data::initializeExisting); }
}
