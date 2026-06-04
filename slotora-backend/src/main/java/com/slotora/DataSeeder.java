package com.slotora;

import com.slotora.entity.*;
import com.slotora.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final BusinessRepository businessRepo;
    private final ServiceRepository serviceRepo;
    private final StaffRepository staffRepo;

    @Override
    public void run(String... args) {
        if (businessRepo.count() > 0) return;

        Business b = new Business();
        b.setName("Slotora Salon");
        b.setCategory("Beauty");
        b.setDescription("Premium hair and beauty services");
        businessRepo.save(b);

        Service s = new Service();
        s.setName("Haircut");
        s.setDurationMins(30);
        s.setPrice(new java.math.BigDecimal("25.00"));
        s.setBusiness(b);
        serviceRepo.save(s);

        Staff st = new Staff();
        st.setName("Sarah");
        st.setRole("Stylist");
        st.setBusiness(b);
        staffRepo.save(st);
    }
}