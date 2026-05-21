// package com.services.in.dto;
// import lombok.AllArgsConstructor;
// import lombok.Builder;
// import lombok.Data;
// import lombok.NoArgsConstructor;
// /**
//  * DTO for GET /api/provider/categories — returns the list of service categories
//  * that the provider sees on SelectServicesScreen.
//  */
// @Data
// @Builder
// @NoArgsConstructor
// @AllArgsConstructor
// public class ServiceCategoryDto {
//     private Long id;
//     /**
//      * Emoji icon, e.g. "🏠"
//      */
//     private String icon;
//     /**
//      * Display title, e.g. "Household"
//      */
//     private String title;
//     /**
//      * Sub-text description, e.g. "Cleaning, Cooking, Maid, etc."
//      */
//     private String description;
// }
package com.services.in.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for GET /api/provider/categories — returns the list of service categories
 * that the provider sees on SelectServicesScreen, now including sub-skills.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceCategoryDto {

    private Long id;

    /**
     * Emoji icon, e.g. "🏠"
     */
    private String icon;

    /**
     * Display title, e.g. "Household"
     */
    private String title;

    /**
     * Sub-text description, e.g. "Cleaning, Cooking, Maid, etc."
     */
    private String description;

    /**
     * List of specific sub-skills under this category. e.g. ["Home Cleaning",
     * "Cooking", "Maid Service", "Laundry", "Baby Sitting"] Frontend uses these
     * to build the grouped skill picker.
     */
    private List<String> subSkills;
}
