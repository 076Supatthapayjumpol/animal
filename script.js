/* script.js */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS Animation
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50,
        mirror: false
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.glass-nav');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Add random delay to explore cards to create a staggered effect
    const exploreCards = document.querySelectorAll('.explore-card');
    exploreCards.forEach((card, index) => {
        // We already have aos-delay in HTML, but we can add some interactive JS here if needed
        // For example, adding a slight parallax effect on mouse move
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.transform = `perspective(1000px) rotateX(${(rect.height / 2 - y) / 15}deg) rotateY(${(x - rect.width / 2) / 15}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            // Reset to hover-up class behavior by removing inline style after a delay
            setTimeout(() => {
                card.style.transform = '';
            }, 300);
        });
    });

    // Animal Filtering Logic
    const searchInput = document.getElementById('searchInput');
    const filterType = document.getElementById('filterType');
    const filterSize = document.getElementById('filterSize');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    const animalGrid = document.getElementById('animalGrid');
    const resultCount = document.getElementById('resultCount');

    if (animalGrid) {
        const animalCards = animalGrid.querySelectorAll('.col-sm-6');

        function filterAnimals() {
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            const typeFilter = filterType ? filterType.value : 'ทั้งหมด';
            const sizeFilter = filterSize ? filterSize.value : 'ทั้งหมด';
            
            let visibleCount = 0;

            animalCards.forEach(card => {
                const titleElement = card.querySelector('.text-primary');
                const typeElement = card.querySelector('.fw-medium');
                // The size element is the second div inside the text-dark container
                const sizeElements = card.querySelectorAll('.text-muted');
                let sizeText = '';
                // Find the size element specifically
                sizeElements.forEach(el => {
                    if(el.textContent.includes('ขนาด:')) {
                        sizeText = el.textContent;
                    }
                });

                const title = titleElement ? titleElement.textContent.toLowerCase() : '';
                const type = typeElement ? typeElement.textContent.trim() : '';
                const size = sizeText.replace('ขนาด: ', '').trim();
                
                const matchSearch = title.includes(searchTerm);
                const matchType = typeFilter === 'ทั้งหมด' || type === typeFilter;
                const matchSize = sizeFilter === 'ทั้งหมด' || size === sizeFilter;

                if (matchSearch && matchType && matchSize) {
                    card.style.display = '';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            if (resultCount) {
                resultCount.textContent = `พบทั้งหมด ${visibleCount} ชนิด`;
            }
        }

        if (searchInput) searchInput.addEventListener('input', filterAnimals);
        if (filterType) filterType.addEventListener('change', filterAnimals);
        if (filterSize) filterSize.addEventListener('change', filterAnimals);
        
        const searchBtn = searchInput ? searchInput.nextElementSibling : null;
        if (searchBtn) searchBtn.addEventListener('click', filterAnimals);

        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                if (filterType) filterType.value = 'ทั้งหมด';
                if (filterSize) filterSize.value = 'ทั้งหมด';
                filterAnimals();
            });
        }
    }

    // General Page Search & Pill Filter Logic (Gallery, Articles, Trivia)
    const pageSearchInput = document.querySelector('.input-group input[placeholder^="ค้นหา"]');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (pageSearchInput || filterButtons.length > 0) {
        function applyFilters() {
            // Determine active main container (assuming one per page)
            const mainContainer = document.querySelector('.container .row.g-4.mb-5')?.closest('.container');
            if (!mainContainer) return;
            
            const cardsContainer = mainContainer.querySelector('.row.g-4.mb-5');
            if (!cardsContainer) return;
            
            const searchTerm = pageSearchInput ? pageSearchInput.value.toLowerCase() : '';
            
            let activeFilter = 'ทั้งหมด';
            const activeBtn = mainContainer.querySelector('.filter-btn.active');
            if (activeBtn) {
                activeFilter = activeBtn.textContent.trim();
            }

            const cards = cardsContainer.children;
            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                
                // 1. Search filter
                const cardText = card.textContent.toLowerCase();
                const matchSearch = searchTerm === '' || cardText.includes(searchTerm);
                
                // 2. Pill filter
                let matchFilter = true;
                if (activeFilter !== 'ทั้งหมด') {
                    let tagText = '';
                    const tagBtn = card.querySelector('.tag-btn');
                    const biTags = card.querySelector('.bi-tags, .bi-tags-fill');
                    
                    if (tagBtn) {
                        tagText = tagBtn.textContent.trim();
                    } else if (biTags && biTags.parentElement) {
                        tagText = biTags.parentElement.textContent.trim();
                    }
                    
                    if (!tagText.includes(activeFilter)) {
                        matchFilter = false;
                    }
                }
                
                if (matchSearch && matchFilter) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            }
        }

        if (pageSearchInput) {
            pageSearchInput.addEventListener('input', applyFilters);
            const pageSearchBtn = pageSearchInput.nextElementSibling;
            if (pageSearchBtn) {
                pageSearchBtn.addEventListener('click', applyFilters);
            }
        }

        if (filterButtons.length > 0) {
            filterButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const parentContainer = this.closest('.d-flex');
                    if (parentContainer) {
                        parentContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                        this.classList.add('active');
                        applyFilters();
                    }
                });
            });
        }
    }
});
