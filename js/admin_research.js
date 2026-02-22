      let currentYear = "ALL YEARS";
        let currentDept = "ALL DEPARTMENTS";

        function setFilter(type, value) {
            if(type === 'year') {
                currentYear = value;
                document.getElementById('yearLabel').innerText = value;
            } else {
                currentDept = value;
                document.getElementById('deptLabel').innerText = value;
            }
            filterPapers();
        }

        function filterPapers() {
            const searchText = document.getElementById('searchInput').value.toLowerCase();
            const cards = document.querySelectorAll('.paper-card');
            let visibleCount = 0;

            cards.forEach(card => {
                const title = card.querySelector('.paper-title').innerText.toLowerCase();
                const year = card.getAttribute('data-year');
                const dept = card.getAttribute('data-dept');

                const matchesSearch = title.includes(searchText);
                const matchesYear = (currentYear === "ALL YEARS" || year === currentYear);
                const matchesDept = (currentDept === "ALL DEPARTMENTS" || dept === currentDept);

                if (matchesSearch && matchesYear && matchesDept) {
                    card.style.display = "block";
                    visibleCount++;
                } else {
                    card.style.display = "none";
                }
            });

            document.getElementById('resultsCount').innerText = `Total Managed Papers: ${visibleCount}`;
            document.getElementById('noResults').style.display = visibleCount === 0 ? "block" : "none";
        }

        function toggleDrop(id) {
            document.querySelectorAll('.dropdown-content').forEach(d => { if(d.id !== id) d.classList.remove('show'); });
            document.getElementById(id).classList.toggle("show");
        }

        window.onclick = function(event) {
            if (!event.target.closest('.dropdown')) {
                document.querySelectorAll('.dropdown-content').forEach(d => d.classList.remove('show'));
            }
        }

        function viewPaper(title) { console.log("Managing: " + title); }