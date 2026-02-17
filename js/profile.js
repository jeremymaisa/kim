const avatarInput = document.getElementById('avatarInput');
        const profileImg = document.getElementById('profileImg');
        const defaultIcon = document.getElementById('defaultIcon');

        avatarInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profileImg.src = e.target.result;
                    profileImg.style.display = 'block';
                    defaultIcon.style.display = 'none';
                }
                reader.readAsDataURL(file);
            }
        });

        function confirmLogout() {
            if (confirm('Log out of ICCTory?')) {
                window.location.href = '../login.html';
            }
        }