// package com.services.in.service;
// import com.services.in.dto.ServiceCategoryDto;
// import com.services.in.entity.ServiceCategory;
// import com.services.in.repository.ServiceCategoryRepository;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;
// import java.util.List;
// /**
//  * Provides the list of service categories shown on SelectServicesScreen.
//  * Categories are pre-seeded by DataSeeder at application startup.
//  */
// @Service
// public class ServiceCategoryService {
//     private final ServiceCategoryRepository categoryRepository;
//     public ServiceCategoryService(ServiceCategoryRepository categoryRepository) {
//         this.categoryRepository = categoryRepository;
//     }
//     @Transactional(readOnly = true)
//     public List<ServiceCategoryDto> getAllActive() {
//         return categoryRepository.findByActiveTrueOrderBySortOrderAsc()
//                 .stream()
//                 .map(this::toDto)
//                 .toList();
//     }
//     private ServiceCategoryDto toDto(ServiceCategory cat) {
//         return ServiceCategoryDto.builder()
//                 .id(cat.getId())
//                 .icon(cat.getIcon())
//                 .title(cat.getTitle())
//                 .description(cat.getDescription())
//                 .build();
//     }
// }





package com.services.in.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.services.in.dto.ServiceCategoryDto;
import com.services.in.entity.ServiceCategory;
import com.services.in.repository.ServiceCategoryRepository;

/**
 * Provides the list of service categories shown on SelectServicesScreen.
 * Categories are pre-seeded by DataSeeder at application startup. Now also
 * returns sub-skills for each category.
 */
@Service
public class ServiceCategoryService {

    private final ServiceCategoryRepository categoryRepository;

    public ServiceCategoryService(ServiceCategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<ServiceCategoryDto> getAllActive() {
        return categoryRepository.findByActiveTrueOrderBySortOrderAsc()
                .stream()
                .map(this::toDto)
                .toList();
    }

    private ServiceCategoryDto toDto(ServiceCategory cat) {
        return ServiceCategoryDto.builder()
                .id(cat.getId())
                .icon(cat.getIcon())
                .title(cat.getTitle())
                .description(cat.getDescription())
                .subSkills(cat.getSubSkills())
                .build();
    }
}
