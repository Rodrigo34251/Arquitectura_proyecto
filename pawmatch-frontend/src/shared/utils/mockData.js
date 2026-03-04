
export const db = {
  users: [
    { id: 1, name: 'Juan Perez', email: 'user@pawmatch.com', role: 'user', password: 'password' },
    { id: 2, name: 'Admin Refugio', email: 'admin@pawmatch.com', role: 'admin', password: 'password' }
  ],
  
  pets: [
    { 
      id: 101, name: 'Max', breed: 'Golden Retriever', age: 2, status: 'Disponible', image: 'max.png',
      size: 'Grande', vaccinated: true, neutered: true, 
      history: 'Max fue rescatado de una construcción. Es súper juguetón, ideal para familias con mucho espacio.'
    },
    { 
      id: 102, name: 'Luna', breed: 'Mestizo', age: 1, status: 'En Proceso', image: 'luna.jpg',
      size: 'Mediano', vaccinated: true, neutered: false, 
      history: 'Luna es un poco tímida al principio, pero muy cariñosa cuando toma confianza.'
    },
    { 
      id: 103, name: 'Bella', breed: 'Siames', age: 3, status: 'Adoptada', image: 'bella.png',
      size: 'Pequeño', vaccinated: true, neutered: true, 
      history: 'Bella es una gata muy tranquila, perfecta para departamentos pequeños.'
    }
  ],

  requests: [
    { 
      id: 501, 
      userId: 1, 
      petId: 102, 
      status: 'Pendiente', 
      date: '2026-03-02',
      evaluation: {
        hasYard: true,
        otherPets: false,
        reason: 'Tengo mucho espacio y tiempo para cuidarla.'
      }
    }
  ]
};