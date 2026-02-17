const data = Array(8).fill({ 
            user: 'Student User', 
            title: 'Development of ICCTory Repository System', 
            date: 'Feb 12, 2026', 
            status: 'Rejected' 
        });

        const container = document.getElementById('rejectedList');
        if (data.length > 0) {
            data.forEach(item => {
                const row = document.createElement('div');
                row.className = 'request-row';
                row.innerHTML = `
                    <span class="cell user-cell">${item.user}</span>
                    <span class="cell title-cell">${item.title}</span>
                    <span class="cell date-cell">${item.date}</span>
                    <span class="cell status-cell">
                        <span class="status-badge rejected">${item.status}</span>
                    </span>`;
                container.appendChild(row);
            });
        } else {
            container.innerHTML = `<p style="text-align:center; padding: 50px; color:rgba(255,255,255,0.2)">No rejected papers found.</p>`;
        }