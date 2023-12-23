document.addEventListener('DOMContentLoaded', function () {
    const inputBookForm = document.getElementById('inputBook');
    const searchBookForm = document.getElementById('searchBook');
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');
  
    // Load books from localStorage on page load
    const books = loadBooksFromStorage();
  
    // Render books to the appropriate shelves
    renderBooks();

    function generateUniqueId() {
      return new Date().getTime();
    }
    
    function addBook(title, author, year, isComplete) {
      const newBook = {
        id: generateUniqueId(),
        title: title,
        author: author,
        year: parseInt(year),
        isComplete: isComplete
      };
    
      // Push the new book into the 'books' array
      books.push(newBook);
    
      return newBook;
    }

    // Function to move a book to the other shelf
    function moveBook(id, isComplete) {
      const bookIndex = findBookIndex(id);
      if (bookIndex !== -1) {
        books[bookIndex].isComplete = !isComplete;
      }
    }

    function confirmDeleteBook(id) {
      const isConfirmed = confirm('Are you sure you want to delete this book?');
      if (isConfirmed) {
          deleteBook(id);
          renderBooks();
      }
    }
  
    // Function to delete a book
    function deleteBook(id) {
      const bookIndex = findBookIndex(id);
      if (bookIndex !== -1) {
        books.splice(bookIndex, 1);
      }
    }

    // Function to edit a book
    function editBook(id) {
      const bookIndex = findBookIndex(id);
      if (bookIndex !== -1) {
          const editedBook = books[bookIndex];
          const newTitle = prompt('Edit title:', editedBook.title);
          const newAuthor = prompt('Edit author:', editedBook.author);
          const newYear = prompt('Edit year:', editedBook.year);
  
          if (newTitle && newAuthor && newYear) {
              editedBook.title = newTitle;
              editedBook.author = newAuthor;
              editedBook.year = newYear;
          } else {
              alert('Please fill in all fields');
          }
      }
    }

    // Function to find the index of a book in the 'books' array based on its ID
    function findBookIndex(id) {
      return books.findIndex((book) => book.id == id);
    }

    // Function to search books based on the title
    function searchBooks(searchTitle) {
      if (typeof searchTitle !== 'string') {
        console.error('searchTitle should be a string');
        return [];
      }

      return books.filter((book) =>
        book.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }

    // Function to create a book element
    function createBookElement(book) {
      const bookItem = document.createElement('article');
      bookItem.classList.add('book_item');

      const titleElement = document.createElement('h3');
      titleElement.textContent = book.title;

      const authorElement = document.createElement('p');
      authorElement.textContent = `Penulis: ${book.author}`;

      const yearElement = document.createElement('p');
      yearElement.textContent = `Tahun: ${book.year}`;

      const actionContainer = document.createElement('div');
      actionContainer.classList.add('action');

      const editButton = document.createElement('button');
      editButton.textContent = 'Edit buku';
      editButton.classList.add('blue'); 
      editButton.dataset.id = book.id;

      const moveButton = document.createElement('button');
      moveButton.textContent = book.isComplete ? 'Belum selesai di Baca' : 'Selesai dibaca';
      moveButton.classList.add('green');
      moveButton.dataset.id = book.id;
      moveButton.dataset.complete = book.isComplete;

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Hapus buku';
      deleteButton.classList.add('red');
      deleteButton.dataset.id = book.id;

      actionContainer.appendChild(moveButton);
      actionContainer.appendChild(deleteButton);
      actionContainer.appendChild(editButton);

      bookItem.appendChild(titleElement);
      bookItem.appendChild(authorElement);
      bookItem.appendChild(yearElement);
      bookItem.appendChild(actionContainer);

      return bookItem;
    }

    // Event listener for adding a new book
    inputBookForm.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const title = document.getElementById('inputBookTitle').value;
      const author = document.getElementById('inputBookAuthor').value;
      const year = document.getElementById('inputBookYear').value;
      const isComplete = document.getElementById('inputBookIsComplete').checked;
  
      // Validate input
      if (title && author && year) {
        // Add a new book to the array
        const newBook = addBook(title, author, year, isComplete);
        
        // Render books after adding a new book
        renderBooks();
  
        // Clear the input fields
        inputBookForm.reset();
      } else {
        alert('Please fill in all fields');
      }
    });

     // Event listener for checkbox change
    const inputBookIsCompleteCheckbox = document.getElementById('inputBookIsComplete');
    inputBookIsCompleteCheckbox.addEventListener('change', function () {
      // Update the text inside the span based on the checkbox status
      const bookSubmitButton = document.getElementById('bookSubmit');
      const spanText = inputBookIsCompleteCheckbox.checked ? 'Selesai dibaca' : 'Belum selesai dibaca';
      bookSubmitButton.querySelector('span').textContent = spanText;
    });

    // Event listener for searching books
    searchBookForm.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const searchTitle = document.getElementById('searchBookTitle').value;
      // Filter books based on the search title
      const filteredBooks = searchBooks(searchTitle);
      
      // Render the filtered books
      renderBooks(filteredBooks);
    });
  
    // Event delegation for moving and deleting books
    document.addEventListener('click', function (e) {
      const target = e.target;
  
      if (target.classList.contains('green')) {
        // Move book to the other shelf
        moveBook(target.dataset.id, target.dataset.complete === 'true');
        renderBooks();
      } else if (target.classList.contains('red')) {
        // Delete book
        confirmDeleteBook(target.dataset.id);
        renderBooks();
      } else if (target.classList.contains('blue')) {
        // Edit book
        editBook(target.dataset.id);
        renderBooks();
      } else if (target.classList.contains('red')) {
        // Confirm and delete book
        confirmDeleteBook(target.dataset.id);
      }
      
    });
  
    // Function to render books to the appropriate shelves
    function renderBooks(filter = null) {
      incompleteBookshelfList.innerHTML = '';
      completeBookshelfList.innerHTML = '';
     
      const filteredBooks = filter ? filter : books;
  
      filteredBooks.forEach((book) => {
        const bookItem = createBookElement(book);
        if (book.isComplete) {
          completeBookshelfList.appendChild(bookItem);
        } else {
          incompleteBookshelfList.appendChild(bookItem);
        }
      });
  
      // Save books to localStorage after rendering
      saveBooksToStorage();
    }
  
    // Function to load books from localStorage
    function loadBooksFromStorage() {
      const storedBooks = localStorage.getItem('books');
      return storedBooks ? JSON.parse(storedBooks) : [];
    }
  
    // Function to save books to localStorage
    function saveBooksToStorage() {
      localStorage.setItem('books', JSON.stringify(books));
    }
  });
  