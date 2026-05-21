package com.services.in.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.services.in.entity.ServiceCategory;
import com.services.in.repository.ServiceCategoryRepository;

/**
 * Seeds the service_categories table with the 10 categories and their
 * sub-skills. Runs once at startup; skips seeding if data is already present
 * (idempotent).
 *
 * Sub-skills are stored in service_category_sub_skills join table and returned
 * via GET /api/provider/categories so the frontend can show a grouped picker
 * (Category → Sub-skills).
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final ServiceCategoryRepository categoryRepository;

    public DataSeeder(ServiceCategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String... args) {
        if (categoryRepository.count() > 0) {
            // Already seeded — nothing to do
            return;
        }

        List<ServiceCategory> categories = List.of(
                build("🏠", "Household", "Cleaning, Cooking, Maid, etc.", 1, List.of(
                        "Home Cleaning",
                        "Deep Cleaning",
                        "Cooking",
                        "Maid Service",
                        "Laundry & Ironing",
                        "Baby Sitting",
                        "Nanny Service",
                        "Dish Washing",
                        "Grocery Shopping"
                )),
                build("🔧", "Repairs", "Plumbing, Carpentry, Painting, etc.", 2, List.of(
                        "Plumbing",
                        "Carpentry",
                        "Home Painting",
                        "Wall Plastering",
                        "Door & Window Repair",
                        "Roof Repair",
                        "Flooring & Tiling",
                        "Waterproofing",
                        "Welding & Fabrication"
                )),
                build("💇", "Personal Care", "Salon, Massage, Grooming, etc.", 3, List.of(
                        "Haircut & Styling",
                        "Facial & Skin Care",
                        "Manicure & Pedicure",
                        "Waxing & Threading",
                        "Massage Therapy",
                        "Bridal Makeup",
                        "Men's Grooming",
                        "Hair Coloring",
                        "Spa Services"
                )),
                build("🏥", "Healthcare", "Nursing, Physiotherapy, Elder Care, etc.", 4, List.of(
                        "Home Nursing",
                        "Physiotherapy",
                        "Elder Care",
                        "Post-Surgery Care",
                        "Medical Equipment Setup",
                        "Medication Management",
                        "Lab Test at Home",
                        "Wound Dressing",
                        "Caretaker Services"
                )),
                build("🚗", "Transport", "Driver, Delivery, Courier, etc.", 5, List.of(
                        "Personal Driver",
                        "Outstation Driver",
                        "Local Delivery",
                        "Courier Services",
                        "School Cab Driver",
                        "Office Cab Driver",
                        "Goods Transport",
                        "Bike Delivery",
                        "Airport Transfer"
                )),
                build("🐾", "Pet & Lifestyle", "Pet Care, Training, Walking, etc.", 6, List.of(
                        "Dog Walking",
                        "Pet Grooming",
                        "Pet Training",
                        "Pet Boarding",
                        "Pet Sitting",
                        "Veterinary Home Visit",
                        "Aquarium Maintenance",
                        "Bird Care",
                        "Pet Transportation"
                )),
                build("💻", "Tech & Support", "AC Repair, Computer, Mobile Repair, etc.", 7, List.of(
                        "AC Repair & Service",
                        "Refrigerator Repair",
                        "Washing Machine Repair",
                        "TV & Electronics Repair",
                        "Computer / Laptop Repair",
                        "Mobile Phone Repair",
                        "Wi-Fi & Networking Setup",
                        "CCTV Installation",
                        "Home Automation"
                )),
                build("🎉", "Events", "Catering, Decor, Photography, etc.", 8, List.of(
                        "Event Catering",
                        "Birthday Decoration",
                        "Wedding Decoration",
                        "Event Photography",
                        "Videography",
                        "DJ & Sound System",
                        "Tent & Furniture Rental",
                        "Event Planning",
                        "Invitation Design"
                )),
                build("🌿", "Outdoor & Safety", "Pest Control, Home Security, Gardening, etc.", 9, List.of(
                        "Pest Control",
                        "Gardening & Landscaping",
                        "Home Security Setup",
                        "Fire Safety Inspection",
                        "Gutter Cleaning",
                        "Water Tank Cleaning",
                        "Septic Tank Cleaning",
                        "Chimney Cleaning",
                        "Solar Panel Cleaning"
                )),
                build("🏊", "Pool Cleaning", "Swimming Pool Cleaning & Maintenance", 10, List.of(
                        "Pool Regular Cleaning",
                        "Pool Deep Cleaning",
                        "Pool Chemical Balancing",
                        "Pool Filter Service",
                        "Pool Pump Repair",
                        "Pool Tile Cleaning",
                        "Pool Water Testing",
                        "Pool Leak Detection",
                        "Pool Equipment Installation"
                ))
        );

        categoryRepository.saveAll(categories);
    }

    private ServiceCategory build(
            String icon, String title, String desc,
            int order, List<String> subSkills) {
        return ServiceCategory.builder()
                .icon(icon)
                .title(title)
                .description(desc)
                .sortOrder(order)
                .active(true)
                .subSkills(subSkills)
                .build();
    }
}
