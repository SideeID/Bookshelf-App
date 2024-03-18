console.log("Hello World!");
const inputBookForm = document.querySelector("#inputBook");
const inputTitle = document.getElementById("inputBookTitle");
const inputAuthor = document.getElementById("inputBookPenulis");
const inputYear = document.getElementById("inputBookTahun");
const inputStatus = document.getElementById("inputBookStatus");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const statusFilter = document.getElementById("status-filter");
const bookList = document.querySelector(".books-shelf");
const bookTitle = document.getElementById("judul");
const bookAuthor = document.getElementById("penulis");
const bookYear = document.getElementById("tahun");
const btnCheck = document.getElementById("btn-check");
const btnDelete = document.querySelectorAll("#btn-hapus");
const btnEdit = document.getElementById("btn-edit");
const editPopup = document.getElementById("edit-popup");
const editBookForm = document.getElementById("edit-books");
const editTitle = document.getElementById("editBookTitle");
const editAuthor = document.getElementById("editBookPenulis");
const editYear = document.getElementById("editBookTahun");
const btnClose = document.querySelectorAll(".btn-cancel");
const btnSave = document.getElementById("btn-save");
const completedBookShelf = document.getElementById("books-shelf-IsCompleted");
const notCompletedBookShelf = document.getElementById("books-shelf-NotCompleted");
let books = [];

const reloadPage = () => {
    location.reload();
}

const toggleStatus = (index) => {
  const book = books[index];
  if (book) {
    books[index].isComplete = !book.isComplete;
    updateLocalStorage();
    renderBooks(books);
  } else {
    console.error(`Buku dengan indeks ${index} tidak ditemukan.`);
  }
};

const deleteBook = (index) => {
  const book = books[index];
  if (book) {
    const shelfId = book.isComplete ? "books-shelf-IsCompleted" : "books-shelf-NotCompleted";
    const shelf = document.getElementById(shelfId);
    const bookElement = document.getElementById(`book-${index}`);
    shelf.removeChild(bookElement);
    books.splice(index, 1);
    updateLocalStorage();
  } else {
    console.error(`Buku dengan indeks ${index} tidak ditemukan.`);
  }
};

const openEditPopup = (index) => {
  const book = books[index];
  editTitle.value = book.title;
  editAuthor.value = book.author;
  editYear.value = book.year;
  editBookForm.setAttribute("data-index", index);
  editPopup.style.display = "block";
};

const closePopup = () => {
  editPopup.style.display = "none";
};

btnClose.forEach((btn) => {
  btn.addEventListener("click", () => {
    closePopup();
  });
});

const displayDeleteConfirmation = (index) => {
  const confirmation = confirm("Apakah Anda yakin ingin menghapus buku ini?");
  if (confirmation) {
      deleteBook(index);
  }
};

completedBookShelf.addEventListener("click", (e) => {
  const targetId = e.target.id;
  const index = parseInt(targetId.split("-")[2]);
  if (!isNaN(index)) {
      if (targetId.startsWith("btn-check")) {
          toggleStatus(index);
      } else if (targetId.startsWith("btn-edit")) {
          openEditPopup(index);
      } else if (targetId.startsWith("btn-hapus")) {
          displayDeleteConfirmation(index)
      }
  } else {
      console.error(`Indeks tidak valid: ${index}`);
  }
});

notCompletedBookShelf.addEventListener("click", (e) => {
  const targetId = e.target.id;
  const index = parseInt(targetId.split("-")[2]);
  if (!isNaN(index)) {
      if (targetId.startsWith("btn-check")) {
          toggleStatus(index);
      } else if (targetId.startsWith("btn-edit")) {
          openEditPopup(index);
      } else if (targetId.startsWith("btn-hapus")) {
          displayDeleteConfirmation(index)
      }
  } else {
      console.error(`Indeks tidak valid: ${index}`);
  }
});

editBookForm.addEventListener("submit", (e) => {
  try {
      e.preventDefault();
      updateBook();
  } catch (error) {
      alert(error);
  }
});

inputBookForm.addEventListener("submit", (e) => {
  try {
      e.preventDefault();
      addBook();
  } catch (error) {
      alert(error);
  }
});

searchButton.addEventListener("click", () => {
  searchBook();
});

statusFilter.addEventListener("change", () => {
  filterBook();
});

document.addEventListener("DOMContentLoaded", () => {
  books = getBooks();
  renderBooks(books);
});

const clearInput = () => {
  inputTitle.value = "";
  inputAuthor.value = "";
  inputYear.value = "";
  inputStatus.value = "";
};

const getBooks = () => {
  return JSON.parse(localStorage.getItem("books")) || [];
};

const renderBooks = (books) => {
  completedBookShelf.innerHTML = "";
  notCompletedBookShelf.innerHTML = "";

  books.forEach((book, index) => {
      const article = document.createElement('article');
      article.innerHTML = `
          <div class="card-books">
              <div>
                  <h3 id="judul-${index}">${book.title}</h3>
                  <p>Penulis: <span id="penulis-${index}">${book.author}</span></p>
                  <p>Tahun: <span id="tahun-${index}">${book.year}</span></p>
                  <p>Status: <span id="status-${index}">${book.isComplete ? 'selesai' : 'belum'} dibaca</span></p>
              </div>
              <div class="btn-bookshelf">
                  <button id="btn-check-${index}" class="btn-check">
                      <i class="fa-solid fa-check"></i>
                  </button>
                  <button id="btn-edit-${index}" class="btn-edit">
                      <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button id="btn-hapus-${index}" class="btn-hapus">
                      <i class="fa-solid fa-trash"></i>
                  </button>
              </div>
          </div>
      `;

      if (book.isComplete) {
          completedBookShelf.appendChild(article);
      } else {
          notCompletedBookShelf.appendChild(article);
      }
  });
};


const addBook = () => {
  const inputTitle = inputBookForm.elements.inputBookTitle.value.trim();
  const inputAuthor = inputBookForm.elements.inputBookPenulis.value.trim();
  const inputYear = parseInt(inputBookForm.elements.inputBookTahun.value);
  const inputStatus = inputBookForm.elements.inputBookStatus.value.trim();

  if (!inputTitle || !inputAuthor || !inputYear || inputStatus === "") {
    throw new Error("Semua field harus diisi");
  }
  if (isNaN(inputYear) || inputYear <= 0) {
    throw new Error("Tahun harus berupa angka positif");
  }

  const newBook = {
    id: +new Date(),
    title: inputTitle,
    author: inputAuthor,
    year: inputYear,
    isComplete: inputStatus === "selesai" ? true : false,
  };

  books.push(newBook);
  updateLocalStorage();
  renderBooks(books);
};

const updateLocalStorage = () => {
  localStorage.setItem("books", JSON.stringify(books));
};

const searchBook = () => {
  const keyword = searchInput.value.trim().toLowerCase();
  const filteredBooks = books.filter((book) => {
      return (
          book.title.toLowerCase().includes(keyword) || book.author.toLowerCase().includes(keyword)
      );
  });
  renderBooks(filteredBooks);
};

const filterBook = () => {
  const status = statusFilter.value;
  const filteredBooks = status === "semua" ? books : books.filter(book => book.isComplete === (status === "selesai"));
  renderBooks(filteredBooks);
};

const updateBook = () => {
  const index = parseInt(editBookForm.getAttribute("data-index"));
  const editedBook = {
    id: books[index].id,
    title: editTitle.value,
    author: editAuthor.value,
    year: parseInt(editYear.value),
    isComplete: books[index].isComplete,
  };

  books[index] = editedBook;
  updateLocalStorage();
  renderBooks(books);
  closePopup();
};