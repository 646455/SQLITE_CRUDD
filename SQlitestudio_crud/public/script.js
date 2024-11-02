document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('userForm');
    const userIdInput = document.getElementById('userId');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const userTableBody = document.querySelector('#userTable tbody');

    // Función para cargar todos los usuarios
    const loadUsers = () => {
        fetch('/api/users')
            .then(response => response.json())
            .then(data => {
                userTableBody.innerHTML = '';
                data.forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>
                            <button onclick="editUser(${user.id})">Editar</button>
                            <button onclick="deleteUser(${user.id})">Eliminar</button>
                        </td>
                    `;
                    userTableBody.appendChild(row);
                });
            });
    };

    // Función para agregar o actualizar un usuario
    form.addEventListener('submit', event => {
        event.preventDefault();
        const userId = userIdInput.value;
        const name = nameInput.value;
        const email = emailInput.value;

        if (userId) {
            // Actualizar usuario existente
            fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email })
            }).then(() => {
                loadUsers();
                form.reset();
            });
        } else {
            // Crear nuevo usuario
            fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email })
            }).then(() => {
                loadUsers();
                form.reset();
            });
        }
    });

    // Función para editar un usuario
    window.editUser = (id) => {
        fetch(`/api/users/${id}`)
            .then(response => response.json())
            .then(user => {
                userIdInput.value = user.id;
                nameInput.value = user.name;
                emailInput.value = user.email;
            });
    };

    // Función para eliminar un usuario
    window.deleteUser = (id) => {
        fetch(`/api/users/${id}`, {
            method: 'DELETE'
        }).then(() => {
            loadUsers();
        });
    };

    // Función para limpiar el formulario
    document.getElementById('clearButton').addEventListener('click', () => {
        form.reset();
    });

    // Cargar usuarios al cargar la página
    loadUsers();
});