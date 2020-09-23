// Listen for form submit
function formSubmitListener() {
  let selectedStates = [];
  let limit = 10;
  $('#form-container').on('submit', function (event) {
    event.preventDefault();
    selectedStates = $('input:checkbox:checked')
      .map(function () {
        return $(this).val();
      })
      .get();
    limit = $('#number').val();
    queryFormatter(selectedStates, limit);
  });
}

// Convert the array of states to the proper query format.

function queryFormatter(selectedStates, limit) {
  let queryString = '?stateCode=';
  for (let i = 0; i < selectedStates.length; i++) {
    if (i !== selectedStates.length - 1) {
      queryString = queryString + `${selectedStates[i]},`;
    } else {
      queryString = queryString + selectedStates[i];
    }
  }
  queryString = queryString + `&limit=${limit}`;
  fetchFromApi(queryString);
}

// Pass form values in to API

function fetchFromApi(queryString) {
  let apiKey = '&api_key=heVgD6xnqDZjshcaSK2SgEVk1YOncxQ5ppmo0pB5';
  var myHeaders = new Headers();
  myHeaders.append('Accept', 'application/vnd.github.mercy-preview+json');

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  fetch(`https://developer.nps.gov/api/v1/parks${queryString + apiKey}`, requestOptions)
    .then((response) => response.json())
    .then((result) => displayResults(result))
    .catch((error) => console.log('error', error));
}

// Pass API data on to webpage via string generator callback

function displayResults(result) {
  $('#results-container').html(htmlStringGenerator(result.data));
  $('#results-container').removeClass('hidden');
  $('.results-title').removeClass('hidden');
}

// String generator callback function

function htmlStringGenerator(result) {
  let htmlString = [];
  for (let i = 0; i < result.length; i++) {
    htmlString.push(`
        <div class="results-box">
            <h3><a href="${result[i].url}">${result[i].fullName}</a></h3>
            <p>${result[i].description}</p>
        </div>
    `);
  }
  return htmlString.join('');
}

// Main function

function main() {
  formSubmitListener();
}

$(main());
