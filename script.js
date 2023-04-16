// URL requests
const categoriesUrl = 'https://remotive.io/api/remote-jobs/categories';
const allJobsUrl = 'https://remotive.io/api/remote-jobs?limit=50';
const jobsByCategoryUrl = 'https://remotive.io/api/remote-jobs?category=';
const jobsBySearchUrl = 'https://remotive.io/api/remote-jobs?search=';
const selectJobs = document.querySelector('#jobs');
let localStorageSavedJobs = localStorage.getItem('localStorageSavedJobs') ?
  JSON.parse(localStorage.getItem('localStorageSavedJobs')) : [];

// Get the "Categories" dropdown element
const categoriesDropdown = document.querySelector('.dropdown-menu');
// Area to show the job cards
const board = document.querySelector('#board_jobs');

// Home Page
const homeScreen = document.querySelector('#board_jobs');
function homePage() {
  const container = document.createElement('div');
  const h1 = document.createElement('h1');
  const para = document.createElement('p');
  const hr = document.createElement('div');
  const h4 = document.createElement('h4');
  homeScreen.innerHTML = "";
  h1.innerText = 'Welcome to our jobs search service';
  para.innerText = `To use our service all you need is a good heart and a little mind 😇`;
  hr.className = 'horizontal-line';
  h4.innerText = `Enjoy `;
  container.className = 'title-container';
  homeScreen.append(container);
  container.append(h1, para, hr, h4);
}
window.addEventListener('load', () => {
  homePage();
});
homePage();

// Loading...
const loadingApi = () => {
  board.innerHTML = "";
  const message = document.getElementById('noSearch');
  const messageNoSaved = document.getElementById('noSavedJobs');
  messageNoSaved.style.display = "none";
  message.style.display = "none"

  const spinnerWrapper = document.createElement('div');
  spinnerWrapper.className = "spinner2";

  const spinner = document.createElement('div');
  spinner.classList.add('spinner-border', 'text-primary');
  spinner.setAttribute('role', 'status');

  const span = document.createElement('span');
  span.classList.add('visually-hidden');
  span.innerText = 'Loading...';

  spinnerWrapper.appendChild(spinner);
  spinner.appendChild(span);
  board.appendChild(spinnerWrapper);
};

// All Jobs
document.getElementById('allJobs').addEventListener('click', () => {
  loadingApi();
  getJobsFromLink(allJobsUrl).then((jobs) => {
    showJobs(jobs);
  });
})
const getJobsFromLink = async (link) => {
  const response = await fetch(link);
  const data = await response.json();
  const { jobs } = data;
  return jobs;
}
const showJobs = (jobs) => {

  try {
    board.innerHTML = '';
    jobs.map((job) => {
      const card = document.createElement('div');
      const bodyCard = document.createElement('div');
      const logo = document.createElement('img');
      const titleJob = document.createElement('h2');
      const salary = document.createElement('p');
      const companyName = document.createElement('p');
      const description = document.createElement('div');
      const jobType = document.createElement('p');
      const btnsDiv = document.createElement('div');
      const seeJobBtn = document.createElement('a');
      const saveJobBtn = document.createElement('button');
      const removeJobBtn = document.createElement('button');

      card.className = 'card';
      card.style.width = '30rem';
      bodyCard.className = 'card-body';

      logo.src = job.company_logo;

      titleJob.className = 'card-title';
      titleJob.innerHTML = job.title;
      jobType.innerHTML = job.job_type;
      companyName.innerHTML = `Company: ${job.company_name}`;
      description.setAttribute('contenteditable', 'true');
      description.setAttribute('spellcheck', 'false');
      description.className = 'card-text 1h-sm no-outline text-muted descClass';
      description.innerHTML = job.description;
      description.style.height = '250px';
      saveJobBtn.className = 'btn_save';
      saveJobBtn.className = 'btn btn-pink btn_save ';
      saveJobBtn.innerHTML = 'Save this job 💖 ';
      removeJobBtn.className = 'btn_remove';
      removeJobBtn.className = 'btn btn-danger btn_remove';
      removeJobBtn.innerHTML = 'Remove 🗑';
      removeJobBtn.style.display = "none";
      let savedJobs = [];
      if (JSON.parse(localStorage.getItem('savedJobs'))) {
        savedJobs = JSON.parse(localStorage.getItem('savedJobs'));
      }

      for (let i = 0; i < savedJobs.length; i++) {
        if (savedJobs[i].id == job.id) {
          saveJobBtn.style.display = "none";
          removeJobBtn.style.display = "inline";
          saveJobBtn.classList.add('saved');
        } else {
          saveJobBtn.style.display = "inline";
          removeJobBtn.style.display = "none";
          saveJobBtn.classList.remove('saved');
        }
      }

      seeJobBtn.className = 'btn btn-success';
      seeJobBtn.innerHTML = 'See this job';
      seeJobBtn.href = job.url;

      saveJobBtn.addEventListener("click", () => {
        let array = [];
        if (JSON.parse(localStorage.getItem('savedJobs'))) {
          array = JSON.parse(localStorage.getItem('savedJobs'));
        }
        array.push(job);
        localStorage.setItem('savedJobs', JSON.stringify((array)));
        saveJobBtn.style.display = "none";
        removeJobBtn.style.display = "inline";
      })

      removeJobBtn.addEventListener("click", () => {
        let array = [];
        if (JSON.parse(localStorage.getItem('savedJobs'))) {
          array = JSON.parse(localStorage.getItem('savedJobs'));
        }
        let newArray = array.filter((item) => item.id !== job.id);
        localStorage.setItem('savedJobs', JSON.stringify((newArray)));
        card.remove();
        const message = document.getElementById('noSavedJobs');
        if (newArray.length == 0) {
          message.style.display = "block";

        }
      })

      saveJobBtn.style.marginRight = '10px';
      btnsDiv.append(saveJobBtn, removeJobBtn, seeJobBtn);
      bodyCard.append(companyName, jobType, salary, description);
      card.append(logo, titleJob, bodyCard, btnsDiv);
      board.append(card);
    });
  } catch (error) {
    console.log(error);
  }
}
// Categories
// Function to add categories to the dropdown menu
const showCategories = async () => {
  try {
    board.innerHTML = '';
    const response = await fetch(categoriesUrl);
    const data = await response.json();
    data.jobs.forEach((category) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.className = 'dropdown-item';
      a.innerHTML = category.name;
      a.addEventListener('click', () => {
        fetchJobsByCategory(category.name);
      })
      li.append(a);
      categoriesDropdown.append(li);
    });
  } catch (error) {
    console.log(error);
  }
};
categoriesDropdown.addEventListener('click', showCategories());
homePage();

// Function to fetch and show jobs by category
const fetchJobsByCategory = (category) => {
  loadingApi();
  const url = jobsByCategoryUrl + category;
  getJobsFromLink(url).then((jobs) => {
    showJobs(jobs);
  });
};

// Saved Jobs
function renderSavedJobs() {
  // Get the existing saved jobs from local storage, or a new empty Map if there are none
  let savedJobs = JSON.parse(localStorage.getItem('savedJobs'));

  const message = document.getElementById('noSavedJobs');
  board.innerHTML = '';
  if (savedJobs.length == 0) {
    message.style.display = "block";

  } else {
    message.style.display = "none";
    showJobs(savedJobs);
  }
}
// Add an event listener to the save job button
const savedJobsLink = document.getElementById("saved-jobs-link");
savedJobsLink.addEventListener("click", () => {
  renderSavedJobs();
});


// Search Jobs
document.getElementById('searchBtn').addEventListener('click', () => {
  const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
  if (searchTerm) {
    loadingApi();
    const searchJobsUrl = `${jobsBySearchUrl}${searchTerm}&limit=50`;
    const message = document.getElementById('noSearch');
    const messageNoSaved = document.getElementById('noSavedJobs');
    messageNoSaved.style.display = "none";
    getJobsFromLink(searchJobsUrl).then((jobs) => {
      board.innerHTML = '';
      if (jobs.length == 0) {
        message.style.display = "block";
      } else {
        message.style.display = "none";
        showJobs(jobs);
      }
    })
      .catch(() => {
        message.style.display = "block";
      });
  }
});