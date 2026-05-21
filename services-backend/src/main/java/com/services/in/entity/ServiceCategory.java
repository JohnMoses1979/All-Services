// package com.services.in.entity;
// import jakarta.persistence.*;
// import lombok.AllArgsConstructor;
// import lombok.Builder;
// import lombok.Data;
// import lombok.NoArgsConstructor;
// /**
//  * Represents a top-level service category shown on SelectServicesScreen.
//  * These are pre-seeded at startup and never created by the labour themselves.
//  *
//  * Matches the SERVICES array in user/SelectServicesScreen.js:
//  *   { id: 1, icon: '🏠', title: 'Household', desc: 'Cleaning, Cooking, Maid, etc.' }
//  */
// @Entity
// @Table(name = "service_categories")
// @Data
// @Builder
// @NoArgsConstructor
// @AllArgsConstructor
// public class ServiceCategory {
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;
//     /**
//      * Display emoji icon, e.g. "🏠"
//      */
//     @Column(nullable = false, length = 10)
//     private String icon;
//     /**
//      * Short title, e.g. "Household"
//      */
//     @Column(nullable = false, length = 100)
//     private String title;
//     /**
//      * Description line, e.g. "Cleaning, Cooking, Maid, etc."
//      */
//     @Column(nullable = false, length = 300)
//     private String description;
//     /**
//      * Sort order for UI display
//      */
//     private Integer sortOrder;
//     /**
//      * Whether this category is currently active / visible
//      */
//     @Builder.Default
//     private Boolean active = true;
// }
package com.services.in.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a top-level service category shown on SelectServicesScreen. Each
 * category now holds a list of sub-skills that providers can choose from.
 *
 * Matches the SERVICES array in user/SelectServicesScreen.js: { id: 1, icon:
 * '🏠', title: 'Household', desc: 'Cleaning, Cooking, Maid, etc.' }
 */
@Entity
@Table(name = "service_categories")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Display emoji icon, e.g. "🏠"
     */
    @Column(nullable = false, length = 10)
    private String icon;

    /**
     * Short title, e.g. "Household"
     */
    @Column(nullable = false, length = 100)
    private String title;

    /**
     * Description line, e.g. "Cleaning, Cooking, Maid, etc."
     */
    @Column(nullable = false, length = 300)
    private String description;

    /**
     * Sort order for UI display
     */
    private Integer sortOrder;

    /**
     * Whether this category is currently active / visible
     */
    @Builder.Default
    private Boolean active = true;

    /**
     * Sub-skills / specific services under this category. e.g. Household →
     * ["Home Cleaning", "Cooking", "Maid Service", "Laundry", "Baby Sitting"]
     * Stored in a separate join table: service_category_sub_skills
     */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "service_category_sub_skills",
            joinColumns = @JoinColumn(name = "category_id")
    )
    @Column(name = "sub_skill", length = 100)
    @OrderColumn(name = "skill_order")
    @Builder.Default
    private List<String> subSkills = new ArrayList<>();
}
            
            
