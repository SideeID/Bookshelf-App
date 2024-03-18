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
let books = [];
const reloadPage = () => {
    location.reload();
}

const toggleStatus = (index) => {
  const book = books[index];
  if (book && book.status) {
    if (book.status === "selesai") {
      books[index].status = "belum";
    //   reloadPage();
        renderBooks(books);
    } else if (book.status === "belum") {
      books[index].status = "selesai";
        // reloadPage();
        renderBooks(books);
    } else {
      console.error(`Status buku dengan indeks ${index} tidak ditemukan.`);
    }
    updateLocalStorage();
    renderBooks(books);
  } else {
    console.error(
      `Buku dengan indeks ${index} tidak ditemukan atau tidak memiliki properti status.`
    );
  }
};

const deleteBook = (index) => {
  books.splice(index, 1);
  updateLocalStorage();
  renderBooks(books);
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

bookList.addEventListener("click", (e) => {
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
    bookList.innerHTML = '';

    books.forEach((book, index) => {
        const article = document.createElement('article');
        article.innerHTML = `
            <div class="card-books">
                <div>
                    <h3 id="judul-${index}">${book.title}</h3>
                    <p>Penulis: <span id="penulis-${index}">${book.author}</span></p>
                    <p>Tahun: <span id="tahun-${index}">${book.year}</span></p>
                    <p>Status: <span id="status-${index}">${book.status} dibaca</span></p>
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
        bookList.appendChild(article);
    });
};


const addBook = () => {
  const inputTitle = inputBookForm.elements.inputBookTitle.value.trim();
  const inputAuthor = inputBookForm.elements.inputBookPenulis.value.trim();
  const inputYear = parseInt(inputBookForm.elements.inputBookTahun.value);
  const inputStatus = inputBookForm.elements.inputBookStatus.value.trim();

  if (!inputTitle || !inputAuthor || !inputYear || !inputStatus) {
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
    status: inputStatus,
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
      book.title.toLowerCase().includes(keyword) ||
      book.author.toLowerCase().includes(keyword)
    );
  });
  renderBooks(filteredBooks);
};

const filterBook = () => {
  const status = statusFilter.value;
  if (status === "semua") {
    renderBooks(books);
  } else {
    const filteredBooks = books.filter((book) => book.status === status);
    renderBooks(filteredBooks);
  }
};

const updateBook = () => {
  const index = parseInt(editBookForm.getAttribute("data-index"));
  const editedBook = {
    id: books[index].id,
    title: editTitle.value,
    author: editAuthor.value,
    year: parseInt(editYear.value),
    status: books[index].status,
  };
  books[index] = editedBook;
  updateLocalStorage();
  renderBooks(books);
  closePopup();
};
